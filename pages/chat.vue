<script lang="ts" setup>
import {computed, nextTick, onMounted, ref, watch} from 'vue';
import {
  MessageCircle as MessageCircleIcon,
  MessageSquare as MessageSquareIcon,
  Moon as MoonIcon,
  Send as SendIcon,
  Smile as SmileIcon,
  Sun as SunIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  X as XIcon
} from 'lucide-vue-next';

// State
const message = ref('');
const messages = ref([]);
const isConnected = ref(false);
const isDark = ref(true);
const showConnectionToast = ref(false);
const messagesContainer = ref(null);
const currentUser = ref(localStorage.getItem('username') ?? '');
let socket;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

// Computed
const connectionStatus = computed(() => {
  return isConnected.value ? 'Connecté' : 'Déconnecté';
});

// Methods
const connectWebSocket = async () => {
  const token = localStorage.getItem('token') ?? '';

  if (!token) {
    alert("Vous devez vous connecter !");
    return;
  }

  try {
    socket = new WebSocket(`ws://localhost:8080?token=${token}`);

    socket.onopen = () => {
      isConnected.value = true;
      showConnectionToast.value = true;
      reconnectAttempts = 0;

      // Masquer le toast après 3 secondes
      setTimeout(() => {
        showConnectionToast.value = false;
      }, 3000);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Si c'est un message initial contenant la liste des messages
      if (Array.isArray(data)) {
        messages.value = data;
        // Extraire le nom d'utilisateur à partir du token (simulation)
        // Dans un cas réel, vous pourriez décoder le JWT ou obtenir cette info du serveur
        currentUser.value = 'Vous'; // À remplacer par la logique réelle
      }
      // Si c'est un nouveau message
      else {
        messages.value.push(data);
      }

      // Scroll vers le bas après l'ajout de nouveaux messages
      scrollToBottom();
    };

    socket.onclose = () => {
      isConnected.value = false;
      showConnectionToast.value = true;

      // Tentative de reconnexion
      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        setTimeout(() => {
          connectWebSocket();
        }, 2000 * reconnectAttempts); // Backoff exponentiel
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      isConnected.value = false;
    };
  } catch (error) {
    console.error("Failed to connect:", error);
    isConnected.value = false;
  }
};

const sendMessage = () => {
  if (socket && message.value.trim() && isConnected.value) {
    socket.send(JSON.stringify({content: message.value}));
    message.value = '';
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const formatTime = (timestamp) => {
  if (!timestamp) return '';

  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
};

const isCurrentUser = (msg) => {
  return msg.username === currentUser.value;
};

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  // Sauvegarder la préférence
  localStorage.setItem('darkMode', isDark.value ? 'true' : 'false');
};

// Lifecycle hooks
onMounted(() => {
  // Charger la préférence de thème
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'true') {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  }

  connectWebSocket();
});

// Surveiller les changements de messages pour scroller automatiquement
watch(messages, () => {
  scrollToBottom();
});
</script>


<template>
  <div :class="isDark ? 'dark bg-gray-900' : 'bg-gray-50'" class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div
              class="h-10 w-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
            <message-circle-icon class="h-5 w-5 text-white"/>
          </div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">Whaptchat</h1>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <span :class="isConnected ? 'bg-green-500' : 'bg-red-500'" class="h-2.5 w-2.5 rounded-full"></span>
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ connectionStatus }}</span>
          </div>
          <button class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  @click="toggleDarkMode">
            <sun-icon v-if="isDark" class="h-5 w-5 text-gray-400"/>
            <moon-icon v-else class="h-5 w-5 text-gray-600"/>
          </button>
        </div>
      </div>
    </header>

    <!-- Chat Container -->
    <div class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
      <!-- Messages Area -->
      <div
          ref="messagesContainer"
          class="flex-1 bg-white dark:bg-gray-800 rounded-t-xl shadow-sm p-4 overflow-y-auto max-h-[75vh]"
      >
        <div
            v-if="messages.length === 0"
            class="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
          <message-square-icon class="h-12 w-12 mb-2"/>
          <p>Aucun message pour le moment</p>
        </div>

        <div v-else class="space-y-4">
          <div
              v-for="(msg, index) in messages"
              :key="index"
              :class="isCurrentUser(msg) ? 'justify-end' : 'justify-start'"
              class="flex"
          >
            <div
                :class="isCurrentUser(msg)
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'"
                class="max-w-[75%] px-4 py-2 rounded-lg shadow-sm"
            >
              <div class="flex items-center space-x-2">
                <span class="font-semibold text-sm">{{ isCurrentUser(msg) ? "Vous" : msg.username }}</span>
                <span class="text-xs opacity-70">{{ formatTime(msg.createdAt) }}</span>
              </div>
              <p class="mt-1 break-words">{{ msg.content }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="bg-white dark:bg-gray-800 rounded-b-xl shadow-sm p-4 border-t border-gray-200 dark:border-gray-700">
        <form class="flex space-x-2" @submit.prevent="sendMessage">
          <div class="flex-1 relative">
            <input
                v-model="message"
                :disabled="!isConnected"
                class="w-full pl-4 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Votre message..."
                type="text"
                @keydown.enter="sendMessage"
            />
            <smile-icon
                class="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
            />
          </div>
          <button
              :disabled="!message.trim() || !isConnected"
              class="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-3 rounded-lg hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50"
              type="submit"
          >
            <send-icon class="h-5 w-5"/>
          </button>
        </form>
      </div>
    </div>

    <!-- Connection Status Toast -->
    <div
        v-if="showConnectionToast"
        :class="isConnected ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'"
        class="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex items-center space-x-3 transition-all duration-300"
    >
      <div :class="isConnected ? 'text-green-500' : 'text-red-500'">
        <wifi-icon v-if="isConnected" class="h-6 w-6"/>
        <wifi-off-icon v-else class="h-6 w-6"/>
      </div>
      <div>
        <p class="font-medium text-gray-900 dark:text-white">{{ isConnected ? 'Connecté' : 'Déconnecté' }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ isConnected ? 'Vous êtes connecté au chat' : 'Tentative de reconnexion...' }}</p>
      </div>
      <button class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" @click="showConnectionToast = false">
        <x-icon class="h-5 w-5"/>
      </button>
    </div>
  </div>
</template>

<style>
/* Add Tailwind dark mode support */
.dark {
  color-scheme: dark;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}

.dark ::-webkit-scrollbar-thumb {
  background-color: rgba(75, 85, 99, 0.5);
}

/* Animation pour les nouveaux messages */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.flex-1 > .space-y-4 > div:last-child {
  animation: fadeIn 0.3s ease-out;
}
</style>