"""Search an exported My Vault JSON file; optionally open a result in a browser.
Usage: python search-vault.py my-vault-backup.json "keyword" [--open]
Uses only Python's standard library. Never executes stored scripts.
"""
import argparse
import json
import webbrowser
from urllib.parse import urlparse
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description="Search your exported My Vault knowledge")
    parser.add_argument("file", type=Path, help="Exported JSON backup")
    parser.add_argument("query", help="Search text")
    parser.add_argument("--open", action="store_true", help="Open the first matching website")
    args = parser.parse_args()
    try:
        records = json.loads(args.file.read_text(encoding="utf-8"))
        if not isinstance(records, list):
            raise ValueError("Expected a JSON list")
    except (OSError, ValueError) as error:
        parser.exit(1, f"Unable to read backup: {error}\n")
    found = []
    for record in records:
        if not isinstance(record, dict):
            continue
        text = " ".join(str(record.get(k, "")) for k in ("title", "description", "content", "category", "steps"))
        if args.query.casefold() in text.casefold():
            found.append(record)
            print(f"[{record.get('category', '')}] {record.get('title', '')}")
            print(record.get("description", ""))
            if record.get("url"):
                print(record["url"])
            print()
    print(f"{len(found)} result(s)")
    if args.open:
        for record in found:
            url = record.get("url", "")
            if urlparse(url).scheme in ("https", "http"):
                webbrowser.open(url)
                break


if __name__ == "__main__":
    main()
