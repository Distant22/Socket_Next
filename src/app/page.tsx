'use client'

import React, { useState, useEffect } from 'react';
const socket = new WebSocket("wss://dt22--elysia--tpccqhcrfjfy.code.run/ws"); // Replace with your server URL

export default function Home() {

  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [newUserID, setNewUserID] = useState<number>(1);

  useEffect(() => {

    async function sendMsg() {
      try {
        socket.send(JSON.stringify({ 
          message: "Entered",
          classID: newUserID 
        }))
        console.log("finished.")
      } catch (error) {
        console.error('Error:', error);
      }
    }

    sendMsg()

    socket.onopen = (msg) => {
      console.log('open connection',msg)
    }

    socket.onmessage = (event) => {
      const receivedMessage = event.data; 
      setMessages((prevMessages) => [...prevMessages, receivedMessage])
      console.log(`Frontend receive ${receivedMessage}`);
    }
    
    socket.onclose = () => {
        console.log('close connection')
    }
  }, []);

  const sendMessage = () => {
    const converted_msg = JSON.stringify({
      message: newMessage,
      classID: newUserID
    })
    socket.send(converted_msg)
    setMessages((prevMessages) => [...prevMessages, `訊息：${newMessage} ｜ 使用者 ID：${newUserID}`])
    setNewMessage('');
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center flex-col space-y-5 bg-blue-100">
      <h1>Websocket 測試</h1>
      <div className="flex space-x-10 justify-center">
        <div>
          <p className="flex justify-center">輸入要傳送的文字：</p>
          <input
            className="m-2 p-1 rounded-lg"
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
        </div>
        <div>
          <p className="flex justify-center">輸入 Live ID：</p>
          <input
            className="m-2 p-1 rounded-lg"
            type="number"
            value={newUserID}
            onChange={(e) => setNewUserID(Number(e.target.value))}
          />
        </div>
      </div>
      <button 
        onClick={sendMessage}
        className="py-3 px-6 rounded-xl bg-black text-white"
      >
        傳送
      </button>
      <p>發送紀錄：</p>
      <div className="h-1/4 w-1/5 bg-white rounded-xl overflow-y-scroll p-4 flex items-center flex-col">
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
    </div>
  );
};

