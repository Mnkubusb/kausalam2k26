#!/usr/bin/env python3
"""Extract team member records from Kaushalam Excel workbook.

Outputs JSON array of members to stdout.
"""

from __future__ import annotations

import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from typing import Dict, List, Optional

NS = {
    "a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}


@dataclass
class MemberRow:
    name: str
    role: str
    category: str


def read_sheet_rows(xlsx_path: str) -> List[Dict[str, str]]:
    with zipfile.ZipFile(xlsx_path) as zf:
        shared_strings: List[str] = []
        if "xl/sharedStrings.xml" in zf.namelist():
            root = ET.fromstring(zf.read("xl/sharedStrings.xml"))
            for si in root.findall("a:si", NS):
                shared_strings.append("".join(t.text or "" for t in si.findall(".//a:t", NS)))

        workbook = ET.fromstring(zf.read("xl/workbook.xml"))
        rels = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
        rid_to_target = {rel.attrib["Id"]: rel.attrib["Target"] for rel in rels}

        first_sheet = workbook.find("a:sheets/a:sheet", NS)
        if first_sheet is None:
            return []

        rid = first_sheet.attrib["{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"]
        sheet_xml = ET.fromstring(zf.read("xl/" + rid_to_target[rid]))

        out_rows: List[Dict[str, str]] = []
        for row in sheet_xml.findall("a:sheetData/a:row", NS):
            parsed: Dict[str, str] = {}
            for cell in row.findall("a:c", NS):
                ref = cell.attrib.get("r", "")
                col = "".join(ch for ch in ref if ch.isalpha())
                if not col:
                    continue

                value = cell.find("a:v", NS)
                if value is None:
                    continue

                raw = value.text or ""
                if cell.attrib.get("t") == "s" and raw.isdigit():
                    idx = int(raw)
                    text = shared_strings[idx] if 0 <= idx < len(shared_strings) else raw
                else:
                    text = raw

                text = str(text).strip()
                if text:
                    parsed[col] = text

            if parsed:
                out_rows.append(parsed)

        return out_rows


def normalize_category(section_name: str) -> str:
    sec = section_name.lower().strip()
    sec = re.sub(r"\s+", " ", sec)

    if "pre events" in sec:
        return "Pre Events"
    if "fun events" in sec:
        return "Fun Events"
    if "color" in sec and "craft" in sec:
        return "Color & Craft Carnival"
    if "food court" in sec:
        return "Food Court"
    if "decoration" in sec:
        return "Decoration"
    if "literary" in sec:
        return "Literary"
    if "technical" in sec:
        return "Technical"
    if "cultural" in sec:
        return "Cultural"
    if "student union" in sec or "coordinator" in sec:
        return "Core"
    return "Operations"


def clean_phone(value: Optional[str]) -> str:
    if not value:
        return ""
    digits = re.sub(r"[^0-9]", "", value)
    return digits


def split_name_phone(text: str) -> tuple[str, str]:
    compact = " ".join(text.split())
    m = re.search(r"(.+?)\s+(\d{8,})$", compact)
    if not m:
        return compact, ""
    return m.group(1).strip(), clean_phone(m.group(2))


def build_members(rows: List[Dict[str, str]]) -> List[MemberRow]:
    members: List[MemberRow] = []
    current_section = ""
    last_event_name = ""

    for row in rows:
        serial = row.get("C", "")
        section = row.get("D", "")
        event_name = row.get("F", "")
        if event_name and event_name.lower() not in {"events", "event", "name"}:
            last_event_name = event_name

        if serial.isdigit() and section:
            current_section = section

            maybe_overall = row.get("E", "")
            if maybe_overall and maybe_overall.lower() not in {"overall coordinator", "events", "event"}:
                name, inline_phone = split_name_phone(maybe_overall)
                role = f"{section.strip()} Overall Coordinator"
                if inline_phone:
                    role += f" ({inline_phone})"
                members.append(
                    MemberRow(name=name, role=role, category=normalize_category(section))
                )

        # Simple table rows (Student Union / Kaushalam Coordinator)
        core_simple_sections = {"student union", "kaushlam coordinator", "kaushalam coordinator"}
        if (
            row.get("F")
            and row.get("G")
            and row.get("H")
            and (current_section or section).strip().lower() in core_simple_sections
            and event_name.lower() not in {"events", "event", "name"}
            and row.get("G", "").strip().lower() not in {"designation", "coordinator"}
        ):
            name = row["F"].strip()
            role = row["G"].strip()
            phone = clean_phone(row.get("H", ""))
            if phone:
                role = f"{role} ({phone})"
            members.append(
                MemberRow(name=name, role=role, category=normalize_category(current_section or section or "Core"))
            )
            continue

        # Event coordinator rows
        if event_name and event_name.lower() not in {"events", "event", "name"}:
            coord = row.get("G", "")
            coord_phone = clean_phone(row.get("H", ""))
            sub = row.get("I", "")
            sub_phone = clean_phone(row.get("J", ""))

            if coord and coord.lower() not in {"coordinator", "designation"}:
                role = f"{event_name} Coordinator"
                if coord_phone:
                    role += f" ({coord_phone})"
                members.append(
                    MemberRow(name=coord.strip(), role=role, category=normalize_category(current_section or section or "Operations"))
                )

            if sub and sub not in {"*", "-"} and sub.lower() not in {"sub coordinator", "overall coordinators"}:
                role = f"{event_name} Sub Coordinator"
                if sub_phone:
                    role += f" ({sub_phone})"
                members.append(
                    MemberRow(name=sub.strip(), role=role, category=normalize_category(current_section or section or "Operations"))
                )

        # Continuation rows may omit event name but include extra coordinators.
        if not event_name and last_event_name:
            coord = row.get("G", "")
            coord_phone = clean_phone(row.get("H", ""))
            sub = row.get("I", "")
            sub_phone = clean_phone(row.get("J", ""))

            if coord and coord.lower() not in {"coordinator", "designation"}:
                role = f"{last_event_name} Coordinator"
                if coord_phone:
                    role += f" ({coord_phone})"
                members.append(
                    MemberRow(name=coord.strip(), role=role, category=normalize_category(current_section or section or "Operations"))
                )

            if sub and sub not in {"*", "-"} and sub.lower() not in {"sub coordinator", "overall coordinators"}:
                role = f"{last_event_name} Sub Coordinator"
                if sub_phone:
                    role += f" ({sub_phone})"
                members.append(
                    MemberRow(name=sub.strip(), role=role, category=normalize_category(current_section or section or "Operations"))
                )

    # De-duplicate exact duplicates while preserving order
    seen = set()
    unique: List[MemberRow] = []
    for m in members:
        key = (m.name.lower(), m.role.lower(), m.category.lower())
        if key in seen:
            continue
        seen.add(key)
        unique.append(m)

    return unique


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit("Usage: extract_team_from_xlsx.py <xlsx_path>")

    xlsx_path = sys.argv[1]
    rows = read_sheet_rows(xlsx_path)
    members = build_members(rows)
    payload = [
        {
            "name": m.name,
            "role": m.role,
            "category": m.category,
            "image": "",
            "links": {},
        }
        for m in members
    ]
    print(json.dumps(payload, ensure_ascii=True))


if __name__ == "__main__":
    main()
