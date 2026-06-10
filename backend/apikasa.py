#!/usr/bin/env python3
"""
apikasa — ANAHTAR://KASA komut satırı yoldaşı
Şifreli kasayı doğrudan okur; backend/arayüz açık olmasına gerek yok.

Parola sırası: --password > $APIKASA_PASSWORD > etkileşimli sorma

Kullanım:
  apikasa list                       # anahtar adlarını listele (değer yok)
  apikasa get GROQ_API_KEY           # tek bir key'in değerini yaz
  apikasa export                     # tüm .env'i stdout'a yaz
  apikasa export > .env              # bir projeye .env üret
  eval "$(apikasa export --shell)"   # mevcut kabuğa export et

Örnek (non-interactive deploy):
  APIKASA_PASSWORD=*** apikasa export > .env
"""
import os
import sys
import argparse
from getpass import getpass

import kasa_core as core


def _get_password(args) -> str:
    if getattr(args, "password", None):
        return args.password
    env = os.environ.get("APIKASA_PASSWORD")
    if env:
        return env
    return getpass("Master parola: ")


def _unlock_or_exit(args) -> bytes:
    if not core.is_initialized():
        sys.exit("Kasa henüz kurulmamış. Önce arayüzden master parola belirle.")
    key = core.unlock(_get_password(args))
    if key is None:
        sys.exit("Yanlış parola.")
    return key


def cmd_list(args):
    key = _unlock_or_exit(args)
    entries = core.load_entries(key)
    if not entries:
        print("(kasa boş)", file=sys.stderr)
        return
    for e in sorted(entries, key=lambda x: x["env"]):
        mark = " " if e.get("val") else "·"  # · = key boş
        print(f"{mark} {e['env']:<32} {e.get('cat','')}")


def cmd_get(args):
    key = _unlock_or_exit(args)
    entries = core.load_entries(key)
    target = args.name.strip()
    for e in entries:
        if e["env"] == target or e["name"].lower() == target.lower():
            if not e.get("val"):
                sys.exit(f"'{target}' kasada var ama değeri boş.")
            print(e["val"])
            return
    sys.exit(f"'{target}' bulunamadı. 'apikasa list' ile bak.")


def cmd_export(args):
    key = _unlock_or_exit(args)
    entries = core.load_entries(key)
    if args.shell:
        # eval "$(apikasa export --shell)" için
        for e in entries:
            if e.get("val"):
                print(f"export {e['env']}={e['val']}")
    else:
        sys.stdout.write(core.build_env(entries))


def main():
    p = argparse.ArgumentParser(prog="apikasa", description="ANAHTAR://KASA CLI")
    p.add_argument("--password", help="master parola (yerine $APIKASA_PASSWORD da olur)")
    sub = p.add_subparsers(dest="cmd", required=True)

    sub.add_parser("list", help="anahtar adlarını listele")

    g = sub.add_parser("get", help="bir key'in değerini yaz")
    g.add_argument("name", help="ENV adı (örn. GROQ_API_KEY) ya da servis adı")

    e = sub.add_parser("export", help="tüm .env'i stdout'a yaz")
    e.add_argument("--shell", action="store_true", help="'export KEY=val' formatında yaz")

    args = p.parse_args()
    {"list": cmd_list, "get": cmd_get, "export": cmd_export}[args.cmd](args)


if __name__ == "__main__":
    main()
