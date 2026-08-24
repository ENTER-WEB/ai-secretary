from __future__ import annotations

import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
IGNORED_PARTS = {"node_modules", ".next", ".git", ".venv", "dist", "build"}

REQUIRED_FILES = [
    "README.md",
    "AGENTS.md",
    "docs/PROJECT_PROFILE.md",
    "docs/00-intake/IDEA.md",
    "docs/00-intake/QUESTIONS.md",
    "docs/00-intake/ASSUMPTIONS.md",
    "docs/01-product/PRD.md",
    "docs/01-product/REQUIREMENTS.md",
    "docs/01-product/NON_FUNCTIONAL_REQUIREMENTS.md",
    "docs/01-product/ACCEPTANCE_CRITERIA.md",
    "docs/02-architecture/SYSTEM_CONTEXT.md",
    "docs/02-architecture/DATA_AND_INTEGRATIONS.md",
    "docs/02-architecture/workspace.dsl",
    "docs/02-architecture/adr/0000-template.md",
    "docs/03-delivery/ROADMAP.md",
    "docs/03-delivery/TASKS.md",
    "docs/03-delivery/TRACEABILITY.md",
    "docs/04-quality/TEST_STRATEGY.md",
    "docs/04-quality/SECURITY.md",
    "docs/04-quality/ENVIRONMENT_HARDWARE_MATRIX.md",
    "docs/05-operations/SLO.md",
    "docs/05-operations/MONITORING.md",
    "docs/05-operations/RUNBOOK.md",
    "docs/05-operations/BACKUP_RESTORE.md",
    "docs/05-operations/INCIDENT_RESPONSE.md",
    "prompts/idea-refiner.md",
    "prompts/requirements-architect.md",
    "prompts/adversarial-reviewer.md",
    "prompts/operations-designer.md",
    "prompts/environment-hardware-reviewer.md",
    "prompts/diagram-generator.md",
    "prompts/release-gatekeeper.md",
    ".devcontainer/devcontainer.json",
    ".github/workflows/quality.yml",
    ".github/PULL_REQUEST_TEMPLATE.md",
]

REQUIRED_AGENT_SECTIONS = [
    "# Purpose",
    "# Source of truth",
    "# Required workflow",
    "# Mandatory review",
    "# Definition of ready",
    "# Definition of done",
    "# Safety",
]


def validate_required_files(errors: list[str]) -> None:
    for relative in REQUIRED_FILES:
        path = ROOT / relative
        if not path.is_file():
            errors.append(f"missing required file: {relative}")
        elif path.stat().st_size == 0:
            errors.append(f"empty required file: {relative}")


def validate_agents(errors: list[str]) -> None:
    text = (ROOT / "AGENTS.md").read_text(encoding="utf-8")
    for section in REQUIRED_AGENT_SECTIONS:
        if section not in text:
            errors.append(f"AGENTS.md missing section: {section}")


def validate_prompts(errors: list[str]) -> None:
    for path in sorted((ROOT / "prompts").glob("*.md")):
        text = path.read_text(encoding="utf-8")
        if not text.startswith("---\n"):
            errors.append(f"prompt missing frontmatter: {path.relative_to(ROOT)}")
        if "description:" not in text:
            errors.append(f"prompt missing description: {path.relative_to(ROOT)}")
        if "# Role" not in text:
            errors.append(f"prompt missing Role: {path.relative_to(ROOT)}")


def validate_markdown_fences(errors: list[str]) -> None:
    for path in ROOT.rglob("*.md"):
        if any(part in IGNORED_PARTS for part in path.relative_to(ROOT).parts):
            continue
        text = path.read_text(encoding="utf-8")
        if text.count("```") % 2:
            errors.append(f"unbalanced code fence: {path.relative_to(ROOT)}")


def validate_internal_links(errors: list[str]) -> None:
    pattern = re.compile(r"\[[^\]]+\]\((?!https?://|#)([^)]+)\)")
    for path in ROOT.rglob("*.md"):
        if any(part in IGNORED_PARTS for part in path.relative_to(ROOT).parts):
            continue
        text = path.read_text(encoding="utf-8")
        for target in pattern.findall(text):
            clean = target.split("#", 1)[0]
            if clean and not (path.parent / clean).resolve().exists():
                errors.append(
                    f"broken relative link in {path.relative_to(ROOT)}: {target}"
                )


def main() -> int:
    errors: list[str] = []
    validate_required_files(errors)
    if not errors:
        validate_agents(errors)
        validate_prompts(errors)
        validate_markdown_fences(errors)
        validate_internal_links(errors)

    if errors:
        print("Repository contract validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print(f"Repository contract validation passed ({len(REQUIRED_FILES)} required files).")
    return 0


if __name__ == "__main__":
    sys.exit(main())

