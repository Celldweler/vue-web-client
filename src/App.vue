<template>
  <v-container>
    <v-card class="chat-container" elevation="2">
      <!-- Chat Messages -->
      <v-card-title>Chat</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="chat-messages" style="height: 400px; overflow-y: auto;">
        <div v-for="(msg, index) in messages" :key="index" class="message">
          <strong>{{ msg.username || "Anonymous" }}:</strong> {{ msg.text }}
        </div>
      </v-card-text>

      <v-divider></v-divider>
      <!-- Message Input -->
      <v-card-actions>
        <v-text-field v-model="username" label="Your username" placeholder="Enter your username" dense></v-text-field>
        <v-text-field v-model="message" label="Type a message" placeholder="Type your message" dense
          class="flex-grow-1"></v-text-field>
        <v-btn color="primary" @click="sendMessage">Send</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { onMounted } from 'vue'
import { ref } from 'vue';

let SignalRHubConnection = (async () => {
  const SignalRubConnectionFunc = new HubConnectionBuilder()
    .configureLogging(LogLevel.Debug)
    // .withUrl("https://localhost:7025/chathub")
    .withUrl("https://chat-api-project.azurewebsites.net/chathub")
    .withAutomaticReconnect()
    .build();

  await SignalRubConnectionFunc.start();

  return SignalRubConnectionFunc;
})();

// Reactive variables
const username = ref(''); // Holds the user's name
const message = ref(''); // Holds the typed message
const messages = ref([]); // List of messages in the chat

// Methods
const sendMessage = () => {
  if (message.value.trim()) {
    // Add the new message to the chat

    var createMsgReq = {
      username: username.value || "Anonymous",
      text: message.value.trim(),
    }
    messages.value.push(createMsgReq);
    message.value = ''; // Clear the message input
  }

  SignalRHubConnection.then((connection) => {
    connection.invoke("SendMessage", createMsgReq.username, createMsgReq.text);
  });
};

onMounted(() => {
  console.log(`the component is now mounted.`)
  console.log(import.meta.env.ApiUrl);
  
  SignalRHubConnection.then((connection) => {
    connection.on("ReceiveMessage", (user, message) => {
      console.log(`You got message: ${message} from ${user}`);
      messages.value.push({username: user, text: message});
    });
  });
})

function senMsg() {
  SignalRHubConnection.then((connection) => {
    connection.invoke("SendMessage", "raime", "hello from raime");
  });
}

</script>

<style>
.chat-container {
  max-width: 600px;
  margin: 0 auto;
}
.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.message {
  padding: 5px;
  border-radius: 4px;
  background-color: #484548;
}
</style>
