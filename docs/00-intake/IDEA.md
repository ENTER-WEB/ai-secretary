# Idea

## One sentence

An anime-avatar desktop web app where a secretary chats with the user, visually reacts (blink and mouth movement), keeps searchable histories, and submits explicitly approved tasks to the locally signed-in Codex client.

## User and problem

- Primary user: the owner of this Windows PC.
- Problem: switching among a chat UI, a human-friendly task view, and Codex makes delegated work hard to track.
- Success: start a conversation, choose an avatar image, review the chat and task transcript separately, and approve a Codex task without exposing credentials to a remote service.

## v1 scope

- Avatar image upload/selection, blink, speech-style mouth animation.
- Chat workspace with a left history list and separate Conversation / Work log tabs.
- Local-only task queue and a guarded Codex bridge contract.
- Explicit approval before any Codex invocation; no unattended desktop, browser, file, or account action.

## Out of scope

- Voice recognition/synthesis, multi-user access, mobile application, cloud sync, autonomous recurring jobs, and direct use of a personal ChatGPT/Codex session token by a web server.
