"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";

type Message = { id: string; role: "user" | "assistant"; text: string; time: string };
type Task = { id: string; title: string; detail: string; status: "draft" | "approved" | "done"; time: string };
type Chat = { id: string; title: string; messages: Message[]; tasks: Task[] };

const time = () => new Intl.DateTimeFormat("ja-JP", { hour: "2-digit", minute: "2-digit" }).format(new Date());
const id = () => Math.random().toString(36).slice(2, 10);

const starterChats: Chat[] = [
  { id: "today", title: "今日の秘書室", messages: [{ id: "a1", role: "assistant", text: "おかえりなさい。今日の仕事を一緒に整理しましょう。\n必要なら、内容を確認してからCodexへ依頼できます。", time: "09:10" }], tasks: [{ id: "t1", title: "作業の準備", detail: "依頼内容をチャットで教えてください。実行前に必ず確認します。", status: "done", time: "09:10" }] },
  { id: "planning", title: "新規プロジェクトの相談", messages: [{ id: "a2", role: "assistant", text: "ここでは企画や依頼内容を整理できます。", time: "昨日" }], tasks: [] },
];

export default function Home() {
  const [chats, setChats] = useState(starterChats);
  const [activeChatId, setActiveChatId] = useState("today");
  const [activeTab, setActiveTab] = useState<"talk" | "work">("talk");
  const [input, setInput] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isResponding, setIsResponding] = useState(false);
  const [notice, setNotice] = useState("ローカルモード：Codexの認証情報はこの画面に保存されません。");
  const activeChat = useMemo(() => chats.find((chat) => chat.id === activeChatId) ?? chats[0], [activeChatId, chats]);

  function updateChat(chatId: string, updater: (chat: Chat) => Chat) { setChats((current) => current.map((chat) => (chat.id === chatId ? updater(chat) : chat))); }
  function createChat() { const chat: Chat = { id: id(), title: "新しい相談", messages: [], tasks: [] }; setChats((current) => [chat, ...current]); setActiveChatId(chat.id); setActiveTab("talk"); }
  function onAvatarChange(event: ChangeEvent<HTMLInputElement>) { const file = event.target.files?.[0]; if (!file) return; if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) { setNotice("画像ファイル（5MB以下）を選んでください。"); return; } setAvatar(URL.createObjectURL(file)); setNotice("アバターを変更しました。この画像はブラウザー内でのみプレビューされます。"); }
  function sendMessage(event: FormEvent) { event.preventDefault(); const text = input.trim(); if (!text) return; updateChat(activeChat.id, (chat) => ({ ...chat, messages: [...chat.messages, { id: id(), role: "user", text, time: time() }] })); setInput(""); setIsResponding(true); window.setTimeout(() => { updateChat(activeChat.id, (chat) => ({ ...chat, messages: [...chat.messages, { id: id(), role: "assistant", text: "承知しました。内容を整理して、必要なら下の「Codexへ依頼する」から作業タスクにできます。", time: time() }] })); setIsResponding(false); }, 700); }
  function draftTask(event: FormEvent) { event.preventDefault(); const detail = taskInput.trim(); if (!detail) return; updateChat(activeChat.id, (chat) => ({ ...chat, tasks: [{ id: id(), title: detail.slice(0, 32), detail, status: "draft", time: time() }, ...chat.tasks] })); setTaskInput(""); setActiveTab("work"); setNotice("タスクを下書きに保存しました。内容を確認してから実行を許可してください。"); }
  async function approveTask(task: Task) {
    setNotice("Codexブリッジへ承認済みタスクを送信しています…");
    try {
      if (window.aiSecretary) {
        const result = await window.aiSecretary.runTask(task.detail);
        updateChat(activeChat.id, (chat) => ({ ...chat, tasks: chat.tasks.map((item) => item.id === task.id ? { ...item, status: "approved" } : item) }));
        setNotice(`Codexに送信しました。対象フォルダ：${result.workspace}`);
        return;
      }
      const response = await fetch("http://127.0.0.1:4317/tasks", { method: "POST", headers: { "content-type": "application/json", "x-ai-secretary-approval": "confirmed" }, body: JSON.stringify({ task: task.detail }) });
      if (!response.ok) throw new Error((await response.json()).error ?? "Bridge rejected the task");
      updateChat(activeChat.id, (chat) => ({ ...chat, tasks: chat.tasks.map((item) => item.id === task.id ? { ...item, status: "approved" } : item) }));
      setNotice("Codexに送信しました。作業履歴で実行許可済みとして確認できます。");
    } catch (error) { setNotice(`送信できませんでした：${error instanceof Error ? error.message : "不明なエラー"}`); }
  }
  async function chooseWorkspace() {
    if (!window.aiSecretary) { setNotice("公開版デスクトップアプリで作業フォルダを選べます。"); return; }
    const workspace = await window.aiSecretary.selectWorkspace();
    setNotice(workspace ? `作業フォルダを選択しました：${workspace}` : "作業フォルダの選択を取り消しました。");
  }

  return <main className="app-shell">
    <aside className="sidebar"><div className="brand"><span className="brand-mark">✦</span><span>秘書室</span></div><button className="new-chat" onClick={createChat}><span>＋</span> 新しい相談</button><div className="history-label">チャット履歴</div><nav className="history" aria-label="チャット履歴">{chats.map((chat) => <button key={chat.id} className={chat.id === activeChat.id ? "history-item active" : "history-item"} onClick={() => setActiveChatId(chat.id)}><span className="history-dot" /><span>{chat.title}</span></button>)}</nav><div className="sidebar-footer"><span className="status-dot" />ローカル秘書モード</div></aside>
    <section className="workspace">
      <header className="topbar"><div><p className="eyebrow">AI SECRETARY</p><h1>{activeChat.title}</h1></div><button className="settings" aria-label="作業フォルダを選ぶ" onClick={chooseWorkspace}>⚙</button></header>
      <section className="stage" aria-label="秘書アバター"><div className={isResponding ? "avatar responding" : "avatar"}><div className="halo" /><div className="avatar-card">{avatar ? <Image src={avatar} alt="選択した秘書アバター" width={135} height={160} unoptimized /> : <div className="avatar-placeholder"><span className="hair" /><span className="face"><i className="eye left" /><i className="eye right" /><i className="mouth" /></span></div>}<span className="blink" /><span className="speech-mouth" /></div></div><div className="stage-copy"><p className="eyebrow">YOUR PERSONAL ASSISTANT</p><h2>お仕事、お預かりします。</h2><p>話す、整理する、確認してCodexに任せる。<br />すべてあなたの許可から始まります。</p><label className="avatar-picker"><input type="file" accept="image/*" onChange={onAvatarChange} />画像を選ぶ</label></div></section>
      <div className="tabs" role="tablist"><button className={activeTab === "talk" ? "tab active" : "tab"} onClick={() => setActiveTab("talk")}>会話 <span>{activeChat.messages.length}</span></button><button className={activeTab === "work" ? "tab active" : "tab"} onClick={() => setActiveTab("work")}>作業履歴 <span>{activeChat.tasks.length}</span></button></div>
      {activeTab === "talk" ? <section className="panel messages" aria-label="会話履歴">{activeChat.messages.length === 0 ? <div className="empty">最初のメッセージを送って、相談を始めましょう。</div> : activeChat.messages.map((message) => <article className={`message ${message.role}`} key={message.id}><div className="message-avatar">{message.role === "assistant" ? "✦" : "あ"}</div><div><div className="bubble">{message.text}</div><time>{message.time}</time></div></article>)}</section> : <section className="panel work-log" aria-label="作業履歴">{activeChat.tasks.length === 0 ? <div className="empty">作業タスクはまだありません。下の欄からCodexへの依頼を下書きできます。</div> : activeChat.tasks.map((task) => <article className="task-card" key={task.id}><div><div className={`task-status ${task.status}`}>{task.status === "draft" ? "確認待ち" : task.status === "approved" ? "実行許可済み" : "完了"}</div><h3>{task.title}</h3><p>{task.detail}</p><time>{task.time}</time></div>{task.status === "draft" && <button className="approve" onClick={() => approveTask(task)}>内容を確認して許可</button>}</article>)}</section>}
      <div className="notice">{notice}</div><form className="composer" onSubmit={activeTab === "talk" ? sendMessage : draftTask}><input value={activeTab === "talk" ? input : taskInput} onChange={(event) => activeTab === "talk" ? setInput(event.target.value) : setTaskInput(event.target.value)} placeholder={activeTab === "talk" ? "秘書に話しかける…" : "Codexに依頼する作業を下書き…"} /><button type="submit">{activeTab === "talk" ? "送信 ↑" : "下書きに追加 ＋"}</button></form>
    </section>
  </main>;
}
