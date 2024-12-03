<template>
    <v-card class="chat-container" elevation="2">
        <v-card-title>Chat</v-card-title>
        <v-divider></v-divider>
        <div></div>
        <v-card-text ref="chatContainer" class="chat-messages" style="height: 400px; overflow-y: auto;">
            <div v-for="(msg, index) in messages" :key="index" class="message">
                <strong>{{ msg.username || "Anonymous" }}:</strong> {{ msg.text }}
            </div>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
            <v-text-field v-model="createMessageModel.senderName" label="Your username"
                placeholder="Enter your username" dense></v-text-field>
            <v-text-field v-model="createMessageModel.text" label="Type a message" placeholder="Type your message" dense
                class="flex-grow-1"></v-text-field>
            <v-btn color="primary" @click="sendMessage">Send</v-btn>
        </v-card-actions>
    </v-card>
</template>


<script setup>
import axios from 'axios';
import { ref, onMounted, nextTick } from 'vue'
import APIRoutes from '@/config/APIRoutes';
import SignalRHubConnection from '@/api-services/SignalRHubConnection';

const chatContainer = ref(null);

const messages = ref([]); // List of messages in the chat
const createMessageModel = ref({
    text: '',
    senderName: '',
})

console.log('message:', createMessageModel.value);

const scrollToBottom = () => {
    nextTick(() => {
        const container = chatContainer.value?.$el || chatContainer.value;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    });
};

const sendMessage = () => {
    if (createMessageModel.value.text.trim()) {

        var newMessage = {
            senderName: createMessageModel.value.senderName || "Anonymous",
            text: createMessageModel.value.text.trim(),
        }
        messages.value.push(newMessage);
        createMessageModel.value.text = '';
        scrollToBottom();
    }

    SignalRHubConnection.then((connection) => {
        console.log('sending message to signalr hub was started');

        connection
            .invoke("SendMessage", newMessage.senderName, newMessage.text)
            .then(res => console.log('signalr response: ', res))
            .catch(er => console.log(er));
    });
};

onMounted(() => {
    console.log(`the component is now mounted.`)

    // GET all chat messages from api
    axios.get(APIRoutes.getMessagesUrl())
        .then(res => {
            messages.value = res.data;

            console.log(messages);

            scrollToBottom();
        })
        .catch(er => console.log(er))

    SignalRHubConnection.then((connection) => {
        connection.on("ReceiveMessage", (user, message) => {
            console.log(`You got message: ${message} from ${user}`);
            messages.value.push({ senderName: user, text: message });
            scrollToBottom();
        });
    });
})
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