#!/usr/bin/env python3
"""Replace arbitrary Tailwind bracket classes with standard scale utilities."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCAN_DIRS = (
    ROOT / "apps/application/app",
    ROOT / "apps/website",
    ROOT / "packages/ui/src",
)

# Order matters: longer / more specific patterns first.
REPLACEMENTS: list[tuple[str, str]] = [
    # Fluid page titles
    (r"text-\[clamp\(32px,5vw,44px\)\]", "text-4xl lg:text-5xl"),
    (r"text-\[clamp\(30px,4\.4vw,40px\)\]", "text-3xl lg:text-4xl"),
    (r"text-\[clamp\(27px,4\.2vw,40px\)\]", "text-3xl lg:text-4xl"),
    (r"text-\[clamp\(26px,4vw,38px\)\]", "text-3xl lg:text-4xl"),
    (r"text-\[clamp\(24px,3\.4vw,31px\)\]", "text-2xl lg:text-3xl"),
    (r"text-\[clamp\(24px,3\.2vw,32px\)\]", "text-2xl lg:text-3xl"),
    (r"text-\[clamp\(19px,2\.4vw,26px\)\]", "text-xl lg:text-2xl"),
    (r"text-\[clamp\(18px,2\.4vw,25px\)\]", "text-xl lg:text-2xl"),
    (r"text-\[clamp\(18px,2\.2vw,22px\)\]", "text-lg lg:text-xl"),
    (r"text-\[clamp\(17px,2\.2vw,21px\)\]", "text-lg lg:text-xl"),
    (r"text-\[clamp\(16px,2vw,19px\)\]", "text-base lg:text-lg"),
    # Font sizes
    (r"sm:text-\[52px\]", "sm:text-5xl"),
    (r"text-\[40px\]", "text-4xl"),
    (r"text-\[34px\]", "text-4xl"),
    (r"text-\[30px\]", "text-3xl"),
    (r"text-\[29px\]", "text-3xl"),
    (r"text-\[28px\]", "text-3xl"),
    (r"text-\[26px\]", "text-2xl"),
    (r"text-\[25px\]", "text-2xl"),
    (r"text-\[23px\]", "text-2xl"),
    (r"text-\[22px\]", "text-2xl"),
    (r"text-\[21px\]", "text-xl"),
    (r"text-\[20px\]", "text-xl"),
    (r"text-\[19px\]", "text-xl"),
    (r"text-\[18px\]", "text-lg"),
    (r"text-\[17px\]", "text-lg"),
    (r"text-\[15\.5px\]", "text-base"),
    (r"text-\[15px\]", "text-base"),
    (r"text-\[14\.5px\]", "text-sm"),
    (r"text-\[14px\]", "text-sm"),
    (r"text-\[13\.5px\]", "text-sm"),
    (r"text-\[13px\]", "text-sm"),
    (r"text-\[12\.5px\]", "text-sm"),
    (r"text-\[12px\]", "text-xs"),
    (r"text-\[11\.5px\]", "text-xs"),
    (r"text-\[11px\]", "text-xs"),
    (r"text-\[10\.5px\]", "text-xs"),
    (r"text-\[10px\]", "text-xs"),
    (r"text-\[9\.5px\]", "text-xs"),
    (r"text-\[9px\]", "text-xs"),
    (r"text-\[8\.5px\]", "text-xs"),
    (r"text-\[8px\]", "text-xs"),
    # Letter spacing
    (r"tracking-\[0\.22em\]", "tracking-widest"),
    (r"tracking-\[0\.18em\]", "tracking-widest"),
    (r"tracking-\[0\.16em\]", "tracking-widest"),
    (r"tracking-\[0\.15em\]", "tracking-wide"),
    (r"tracking-\[0\.14em\]", "tracking-wide"),
    (r"tracking-\[0\.13em\]", "tracking-wide"),
    (r"tracking-\[0\.12em\]", "tracking-wide"),
    (r"tracking-\[0\.1em\]", "tracking-widest"),
    (r"tracking-\[0\.08em\]", "tracking-wide"),
    (r"tracking-\[0\.06em\]", "tracking-normal"),
    (r"tracking-\[0\.04em\]", "tracking-normal"),
    # Prose widths
    (r"max-w-\[74ch\]", "max-w-prose"),
    (r"max-w-\[72ch\]", "max-w-prose"),
    (r"max-w-\[70ch\]", "max-w-prose"),
    (r"max-w-\[66ch\]", "max-w-prose"),
    (r"max-w-\[62ch\]", "max-w-prose"),
    (r"max-w-\[60ch\]", "max-w-prose"),
    (r"max-w-\[58ch\]", "max-w-prose"),
    (r"max-w-\[56ch\]", "max-w-prose"),
    (r"max-w-\[54ch\]", "max-w-prose"),
    (r"max-w-\[52ch\]", "max-w-prose"),
    # Radius
    (r"rounded-\[20px\]", "rounded-2xl"),
    (r"rounded-\[18px\]", "rounded-2xl"),
    (r"rounded-\[16px\]", "rounded-2xl"),
    (r"rounded-\[14px\]", "rounded-xl"),
    (r"rounded-\[10px\]", "rounded-lg"),
    (r"rounded-\[9px\]", "rounded-lg"),
    # Layout / sizing
    (r"max-w-\[1240px\]", "max-w-7xl"),
    (r"min-w-\[320px\]", "min-w-80"),
    (r"min-w-\[200px\]", "min-w-48"),
    (r"min-w-\[160px\]", "min-w-40"),
    (r"min-w-\[140px\]", "min-w-36"),
    (r"size-\[34px\]", "size-9"),
    (r"accent-\[var\(--color-accent\)\]", "accent-accent"),
    (r"backdrop-blur-\[14px\]", "backdrop-blur-md"),
    (r"border-t-\[3px\]", "border-t-4"),
    (r"focus-visible:ring-\[3px\]", "focus-visible:ring-4"),
    (r"p-\[clamp\(20px,3vw,26px\)\]", "p-5 lg:p-6"),
    (r"p-\[clamp\(16px,2\.4vw,20px\)\]", "p-4 lg:p-5"),
    (r"gap-\[clamp\(16px,3vw,30px\)\]", "gap-4 lg:gap-8"),
    (r"mb-\[18px\]", "mb-4"),
    # Fluid auto-fit grids → responsive columns
    (
        r"grid-cols-\[repeat\(auto-fit,minmax\(clamp\(260px,31%,460px\),1fr\)\)\]",
        "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    ),
    (
        r"grid-cols-\[repeat\(auto-fit,minmax\(clamp\(240px,31%,400px\),1fr\)\)\]",
        "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    ),
    (
        r"grid-cols-\[repeat\(auto-fit,minmax\(clamp\(240px,30%,340px\),1fr\)\)\]",
        "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    ),
    (
        r"grid-cols-\[repeat\(auto-fit,minmax\(clamp\(240px,45%,420px\),1fr\)\)\]",
        "grid-cols-1 lg:grid-cols-2",
    ),
    (
        r"grid-cols-\[repeat\(auto-fit,minmax\(clamp\(200px,24%,300px\),1fr\)\)\]",
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    ),
    (
        r"grid-cols-\[repeat\(auto-fit,minmax\(clamp\(180px,30%,260px\),1fr\)\)\]",
        "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
    ),
    (
        r"grid-cols-\[repeat\(auto-fit,minmax\(clamp\(150px,30%,240px\),1fr\)\)\]",
        "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
    ),
    (
        r"grid-cols-\[repeat\(auto-fit,minmax\(140px,1fr\)\)\]",
        "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
    ),
    (
        r"grid-cols-\[repeat\(auto-fit,minmax\(300px,1fr\)\)\]",
        "grid-cols-1 lg:grid-cols-2",
    ),
    # Settings / form layouts — handled manually in layout components
    # Flex basis
    (r"flex-\[1_1_340px\]", "min-w-0 flex-1 basis-80"),
    (r"flex-\[1_1_300px\]", "min-w-0 flex-1 basis-72"),
    (r"flex-\[1_1_260px\]", "min-w-0 flex-1 basis-64"),
    (r"leading-\[1\.3\]", "leading-snug"),
    (r"leading-\[1\.4\]", "leading-snug"),
    (r"leading-\[1\.08\]", "leading-tight"),
    (r"leading-\[1\.65\]", "leading-relaxed"),
    (r"leading-\[1\.55\]", "leading-relaxed"),
    (r"leading-\[1\.6\]", "leading-relaxed"),
    (r"active:scale-\[0\.985\]", "active:scale-95"),
    (r"active:scale-\[0\.97\]", "active:scale-95"),
    (r"max-w-\[900px\]", "max-w-4xl"),
    (r"max-w-\[1180px\]", "max-w-6xl"),
    (r"max-w-\[30ch\]", "max-w-prose"),
    (r"max-w-\[20ch\]", "max-w-sm"),
    (r"max-w-\[24ch\]", "max-w-sm"),
    (r"max-w-\[44ch\]", "max-w-prose"),
    (r"max-w-\[420px\]", "max-w-md"),
    (r"rounded-\[24px\]", "rounded-3xl"),
    (r"rounded-\[12px\]", "rounded-xl"),
    (r"rounded-\[11px\]", "rounded-lg"),
    (r"rounded-\[5px\]", "rounded-sm"),
    (r"py-3\.25", "py-3"),
    (r"flex-\[0_1_210px\]", "w-full shrink-0 sm:w-52"),
    (r"w-\[min\(340px,calc\(100vw-24px\)\)\]", "w-full max-w-sm"),
    # Website / landing — fluid spacing & typography
    (r"text-\[clamp\(36px,6vw,62px\)\]", "text-4xl sm:text-5xl lg:text-6xl"),
    (r"text-\[clamp\(26px,3\.6vw,38px\)\]", "text-3xl lg:text-4xl"),
    (r"text-\[clamp\(26px,3\.4vw,36px\)\]", "text-3xl lg:text-4xl"),
    (r"text-\[clamp\(22px,3\.2vw,32px\)\]", "text-2xl lg:text-3xl"),
    (r"text-\[clamp\(19px,2\.2vw,23px\)\]", "text-xl lg:text-2xl"),
    (r"text-\[clamp\(16px,1\.6vw,18\.5px\)\]", "text-base lg:text-lg"),
    (r"px-\[clamp\(14px,3vw,22px\)\]", "px-4 lg:px-6"),
    (r"py-\[clamp\(48px,8vw,96px\)\]", "py-12 lg:py-24"),
    (r"py-\[clamp\(40px,6vw,80px\)\]", "py-10 lg:py-20"),
    (r"py-\[clamp\(40px,6vw,72px\)\]", "py-10 lg:py-16"),
    (r"py-\[clamp\(36px,6vw,88px\)\]", "py-10 lg:py-20"),
    (r"py-\[clamp\(36px,6vw,72px\)\]", "py-10 lg:py-16"),
    (r"pb-\[clamp\(48px,8vw,100px\)\]", "pb-12 lg:pb-24"),
    (r"pb-\[clamp\(40px,6vw,72px\)\]", "pb-10 lg:pb-16"),
    (r"p-\[clamp\(26px,4vw,44px\)\]", "p-6 lg:p-10"),
    (r"p-\[clamp\(20px,3vw,28px\)\]", "p-5 lg:p-7"),
    (r"p-\[22px\]", "p-5"),
    (r"gap-\[clamp\(32px,5vw,64px\)\]", "gap-8 lg:gap-16"),
    (r"gap-\[clamp\(28px,4vw,56px\)\]", "gap-7 lg:gap-14"),
    (r"gap-\[clamp\(26px,4vw,56px\)\]", "gap-7 lg:gap-14"),
    (r"gap-\[clamp\(24px,4vw,48px\)\]", "gap-6 lg:gap-12"),
    (r"gap-\[clamp\(24px,3vw,48px\)\]", "gap-6 lg:gap-12"),
    (r"gap-\[clamp\(14px,2\.5vw,26px\)\]", "gap-4 lg:gap-6"),
    (r"gap-\[clamp\(12px,2vw,22px\)\]", "gap-3 lg:gap-5"),
    (r"gap-\[14px\]", "gap-3.5"),
    (r"gap-\[13px\]", "gap-3"),
    (r"gap-\[11px\]", "gap-2.5"),
    (r"gap-\[10px\]", "gap-2.5"),
    (r"gap-\[9px\]", "gap-2"),
    (r"gap-\[7px\]", "gap-1.5"),
    (r"gap-\[6px\]", "gap-1.5"),
    (r"gap-\[5px\]", "gap-1"),
    (r"gap-\[3px\]", "gap-0.5"),
    (r"gap-\[42px\]", "gap-10"),
    (r"mt-\[30px\]", "mt-8"),
    (r"mt-\[18px\]", "mt-4"),
    (r"mt-\[14px\]", "mt-3.5"),
    (r"mt-\[6px\]", "mt-1.5"),
    (r"mt-\[1px\]", "mt-px"),
    (r"mb-\[34px\]", "mb-8"),
    (r"mb-\[30px\]", "mb-8"),
    (r"mb-\[22px\]", "mb-5"),
    (r"mb-\[14px\]", "mb-3.5"),
    (r"mb-\[10px\]", "mb-2.5"),
    (r"pt-\[30px\]", "pt-8"),
    (r"pt-\[10px\]", "pt-2.5"),
    (r"pb-\[30px\]", "pb-8"),
    (r"py-\[34px\]", "py-8"),
    (r"py-\[15px\]", "py-4"),
    (r"py-\[14px\]", "py-3.5"),
    (r"py-\[13px\]", "py-3"),
    (r"py-\[11px\]", "py-2.5"),
    (r"py-\[9px\]", "py-2"),
    (r"py-\[6px\]", "py-1.5"),
    (r"py-\[5px\]", "py-1"),
    (r"px-\[26px\]", "px-6"),
    (r"px-\[15px\]", "px-4"),
    (r"px-\[14px\]", "px-3.5"),
    (r"px-\[11px\]", "px-3"),
    (r"pr-\[42px\]", "pr-10"),
    (r"bottom-\[10px\]", "bottom-2.5"),
    (r"h-\[3px\]", "h-1"),
    (r"h-\[2px\]", "h-0.5"),
    (r"h-\[10px\]", "h-2.5"),
    (r"size-\[44px\]", "size-11"),
    (r"size-\[38px\]", "size-10"),
    (r"size-\[30px\]", "size-8"),
    (r"size-\[18px\]", "size-4"),
    (r"size-\[6px\]", "size-1.5"),
    (r"size-\[5px\]", "size-1"),
    (r"rounded-\[22px\]", "rounded-2xl"),
    (r"rounded-\[2px\]", "rounded-sm"),
    (r"max-w-\[46ch\]", "max-w-prose"),
    (r"max-w-\[26ch\]", "max-w-md"),
    (r"max-w-\[18ch\]", "max-w-xs"),
    (r"leading-\[1\.04\]", "leading-tight"),
    (r"leading-\[1\.5\]", "leading-normal"),
    (r"leading-\[1\.7\]", "leading-relaxed"),
    (r"leading-\[1\.8\]", "leading-loose"),
    (r"tracking-\[0\.2em\]", "tracking-widest"),
    (r"tracking-\[0\.05em\]", "tracking-wide"),
    (r"tracking-\[0\.02em\]", "tracking-normal"),
    (r"transition-\[filter\]", "transition-all"),
    (r"flex-\[1_1_420px\]", "min-w-0 flex-1 basis-96"),
    (r"flex-\[1_1_380px\]", "min-w-0 flex-1 basis-96"),
    (r"flex-\[1_1_320px\]", "min-w-0 flex-1 basis-80"),
    (r"flex-\[3_1_340px\]", "min-w-0 flex-1 basis-80 lg:flex-[2]"),
    (r"flex-\[2_1_280px\]", "min-w-0 flex-1 basis-72"),
]


def normalize(content: str) -> str:
    for pattern, repl in REPLACEMENTS:
        content = re.sub(pattern, repl, content)
    return content


def main() -> None:
    changed: list[str] = []
    for base in SCAN_DIRS:
        for path in base.rglob("*.tsx"):
            original = path.read_text(encoding="utf-8")
            updated = normalize(original)
            if updated != original:
                path.write_text(updated, encoding="utf-8")
                changed.append(str(path.relative_to(ROOT)))

    print(f"Updated {len(changed)} files")
    for name in sorted(changed):
        print(f"  {name}")


if __name__ == "__main__":
    main()
