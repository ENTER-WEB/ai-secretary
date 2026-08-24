$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $scriptRoot
$requiredFiles = @(
    'README.md',
    'AGENTS.md',
    'docs/PROJECT_PROFILE.md',
    'docs/00-intake/IDEA.md',
    'docs/00-intake/QUESTIONS.md',
    'docs/00-intake/ASSUMPTIONS.md',
    'docs/01-product/PRD.md',
    'docs/01-product/REQUIREMENTS.md',
    'docs/01-product/NON_FUNCTIONAL_REQUIREMENTS.md',
    'docs/01-product/ACCEPTANCE_CRITERIA.md',
    'docs/02-architecture/SYSTEM_CONTEXT.md',
    'docs/02-architecture/DATA_AND_INTEGRATIONS.md',
    'docs/02-architecture/workspace.dsl',
    'docs/02-architecture/adr/0000-template.md',
    'docs/03-delivery/ROADMAP.md',
    'docs/03-delivery/TASKS.md',
    'docs/03-delivery/TRACEABILITY.md',
    'docs/04-quality/TEST_STRATEGY.md',
    'docs/04-quality/SECURITY.md',
    'docs/04-quality/ENVIRONMENT_HARDWARE_MATRIX.md',
    'docs/05-operations/SLO.md',
    'docs/05-operations/MONITORING.md',
    'docs/05-operations/RUNBOOK.md',
    'docs/05-operations/BACKUP_RESTORE.md',
    'docs/05-operations/INCIDENT_RESPONSE.md',
    'prompts/idea-refiner.md',
    'prompts/requirements-architect.md',
    'prompts/adversarial-reviewer.md',
    'prompts/operations-designer.md',
    'prompts/environment-hardware-reviewer.md',
    'prompts/diagram-generator.md',
    'prompts/release-gatekeeper.md',
    '.devcontainer/devcontainer.json',
    '.github/workflows/quality.yml',
    '.github/PULL_REQUEST_TEMPLATE.md'
)

$errors = [System.Collections.Generic.List[string]]::new()
foreach ($relative in $requiredFiles) {
    $path = Join-Path $repoRoot $relative
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
        $errors.Add("missing required file: $relative")
    }
    elseif ((Get-Item -LiteralPath $path).Length -eq 0) {
        $errors.Add("empty required file: $relative")
    }
}

$agentSections = @(
    '# Purpose', '# Source of truth', '# Required workflow',
    '# Mandatory review', '# Definition of ready', '# Definition of done', '# Safety'
)
$agents = Get-Content -LiteralPath (Join-Path $repoRoot 'AGENTS.md') -Raw -Encoding UTF8
foreach ($section in $agentSections) {
    if (-not $agents.Contains($section)) {
        $errors.Add("AGENTS.md missing section: $section")
    }
}

Get-ChildItem -LiteralPath (Join-Path $repoRoot 'prompts') -Filter '*.md' | ForEach-Object {
    $text = Get-Content -LiteralPath $_.FullName -Raw -Encoding UTF8
    if (-not $text.StartsWith("---`n") -and -not $text.StartsWith("---`r`n")) {
        $errors.Add("prompt missing frontmatter: $($_.Name)")
    }
    if (-not $text.Contains('description:')) {
        $errors.Add("prompt missing description: $($_.Name)")
    }
    if (-not $text.Contains('# Role')) {
        $errors.Add("prompt missing Role: $($_.Name)")
    }
}

Get-ChildItem -LiteralPath $repoRoot -Recurse -Filter '*.md' | ForEach-Object {
    $text = Get-Content -LiteralPath $_.FullName -Raw -Encoding UTF8
    $fenceCount = ([regex]::Matches($text, '```')).Count
    if ($fenceCount % 2 -ne 0) {
        $errors.Add("unbalanced code fence: $($_.FullName.Substring($repoRoot.Length + 1))")
    }
}

if ($errors.Count -gt 0) {
    Write-Output 'Repository contract validation failed:'
    $errors | ForEach-Object { Write-Output "- $_" }
    exit 1
}

Write-Output "Repository contract validation passed ($($requiredFiles.Count) required files)."
