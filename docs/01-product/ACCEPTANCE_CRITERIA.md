# Acceptance Criteria

| ID | Requirement | Given | When | Then | Test |
|---|---|---|---|---|---|
| AC-001 | FR-001 | The app is open | The user chooses an image file | The preview changes to that image without uploading it | Manual UI test |
| AC-002 | FR-002 | An avatar is visible | The assistant transitions between idle and responding | Blink and mouth states visibly change; reduced-motion preference disables animation | UI test |
| AC-003 | FR-003 | Two chats exist | The user selects one from history or creates a new chat | Only that chat's messages are shown and title is visible | UI test |
| AC-004 | FR-004 | A chat has task records | The user chooses either history tab | Conversation and task transcript are independently visible | UI test |
| AC-005 | FR-005 | A task draft exists | The user presses approve | The bridge receives one approved invocation request; cancel sends none | Integration test |
| AC-006 | FR-006 | Normal v1 use | The user chats, uploads an avatar, or drafts tasks | No network request or credential value is required by the app | Network inspection / source review |
