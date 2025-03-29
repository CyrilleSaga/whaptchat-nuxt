<script lang="ts" setup>
import {ref} from 'vue';
import {
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Lock as LockIcon,
  Mail as MailIcon,
  MessageCircle as MessageCircleIcon
} from 'lucide-vue-next';

// Form state
const username = ref('');
const password = ref('');
const showPassword = ref(false);
const isDark = ref(true);

const toast = useToast()
const nuxtRouter = useRouter()

// Handle register submission
const handleRegister = async () => {
  try {
    const response = await useFetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    if (response.status.value != 'success') {
      toast.add({
        title: 'Error',
        description: 'Error during registration',
        icon: 'i-lucide-alert-circle',
        color: 'error',
      })
      return
    }

    await nuxtRouter.push('/');

  } catch (error) {
    toast.add({
      title: 'Error',
      description: `Error during registration: ${error}`,
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
};
</script>

<template>
  <div :class="isDark ? 'dark bg-gray-900' : 'bg-gray-50'" class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Card Container -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <!-- Header with Logo -->
        <div class="p-6 text-center border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-center mb-2">
            <div
                class="h-12 w-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
              <message-circle-icon class="h-6 w-6 text-white"/>
            </div>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Whaptchat</h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">Sign up to create your account</p>
        </div>

        <!-- Login Form -->
        <div class="p-6">
          <form @submit.prevent="handleRegister">
            <!-- Email Input -->
            <div class="mb-4">
              <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  for="username">Username</label>
              <div class="relative">
                <mail-icon class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"/>
                <input
                    id="username"
                    v-model="username"
                    class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Jean"
                    required
                    type="text"
                />
              </div>
            </div>

            <!-- Password Input -->
            <div class="mb-6">
              <div class="flex items-center justify-between mb-1">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                       for="password">Password</label>
                <a class="text-sm text-purple-600 hover:text-purple-500 dark:text-purple-400" href="#">Forgot
                  password?</a>
              </div>
              <div class="relative">
                <lock-icon class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"/>
                <input
                    id="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    class="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="••••••••"
                    required
                />
                <button
                    class="absolute right-3 top-1/2 transform -translate-y-1/2"
                    type="button"
                    @click="showPassword = !showPassword"
                >
                  <eye-icon v-if="!showPassword" class="h-5 w-5 text-gray-400"/>
                  <eye-off-icon v-else class="h-5 w-5 text-gray-400"/>
                </button>
              </div>
            </div>

            <!-- Login Button -->
            <button
                class="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                type="submit"
            >
              Sign up
            </button>
          </form>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4  dark:bg-gray-750 border-t  dark:border-gray-700 text-center">
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Already have an account?
            <NuxtLink
                class="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400"
                to="/">
              Sign in
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>


<style>
/* Add Tailwind dark mode support */
.dark {
  color-scheme: dark;
}

/* Custom color for dark mode background that's slightly lighter than gray-800 */
.dark .bg-gray-750 {
  background-color: #2d3748;
}
</style>