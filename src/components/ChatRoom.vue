<template>
    <v-card class="chat-container" elevation="2">
        <v-card-title>Anonymous Chat</v-card-title>
        <v-divider></v-divider>
        <v-card-text ref="chatContainer" class="chat-messages" style="height: 400px; overflow-y: auto;">
            <div
                v-for="(msg, index) in messages"
                :key="index"
                class="message"
                :style="{ backgroundColor: getMessageBackgroundColor(msg.textSentiment) }"
            >
                <div style="display: flex; justify-content: space-between;">
                    <div>
                        <strong>{{ msg.username || "Anonymous" }}:</strong> {{ msg.text }}
                    </div>

                    <p>{{ formatTimestamp(msg.createdAt) }}</p>
                </div>
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
import { formatTimestamp, formatDate, formatTimeFromDateString } from '@/utils/dateUtils';

const chatContainer = ref(null);

const messages = ref([]);
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
        createMessageModel.value.text = '';
    }

    SignalRHubConnection.then((connection) => {
        console.log('sending message to signalr hub was started');

        connection
            .invoke("SendMessage", newMessage.senderName, newMessage.text)
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
        connection.on("ReceiveMessage", (messageDto) => {
            console.log(`You got message: ${messageDto.text} from ${messageDto.sender}`);
            messages.value.push(messageDto);
            scrollToBottom();
        });
    });
})

const getMessageBackgroundColor = (sentiment) => {
    console.log('getMessageBackgroundColor: ',sentiment);
    
    switch (sentiment) {
        case 'Positive':
            return '#0a7b33';
        case 'Neutral':
            return '#7b7a0a';
        case 'Negative':
            return '#681c1c';
        case 'Mixed':
        default:
            return '#484548';
    }
};
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
}
</style>