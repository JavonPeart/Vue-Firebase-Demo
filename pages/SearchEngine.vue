<template>
  <div class="container">

    <!-- For the checking progress and tallying search -->
    <div class="column blank">

    </div>

    <!-- Handles the search enginge -->
    <div class="column search">
      <div class="search-container">
        <h1 class="title">Earn & Learn</h1>
        <form class="search-form" @submit.prevent="handleSearch">
          <input
            v-model="query"
            type="text"
            :placeholder="placeholderMessage"
            class="search-input"
          />
          <button type="submit" class="search-button">Search</button>
        </form>
      </div>
    </div>

    <!-- Manages Friends List -->
    <div class="column friends">
      <div class="friends-section">
        <form @submit.prevent="addFriend" class="friend-form">
          <input
            v-model="newFriend"
            type="text"
            placeholder="Add a friend"
            class="friend-input"
          />
          <button type="submit" class="friend-button">Add Friend</button>
        </form>
        <ul class="friends-list">
          <li v-for="friend in friends" :key="friend">{{ friend }}</li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';



// Data variables
const query = ref('');
const placeholderMessage = ref('');
const newFriend = ref('');
const friends = ref<string[]>([]);

// Array of placeholder messages
const placeholders = [
  'Search for jobs, learning resources...',
  'Find your next career opportunity...',
  'Explore new learning materials...',
  'Discover jobs and educational resources...'
];

// Fetch Firestore instance from Nuxt app
const $firestore = getFirestore();


// Method to handle the search logic
const handleSearch = () => {
  if (query.value) {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query.value)}`;
    window.open(searchUrl, '_blank');
  }
};

// Method to set a random placeholder message
const setRandomPlaceholder = () => {
  const randomIndex = Math.floor(Math.random() * placeholders.length);
  placeholderMessage.value = placeholders[randomIndex];
};

// Set a random placeholder message when the component is mounted
onMounted(() => {
  setRandomPlaceholder();
  fetchFriends();
});

// Method to add a friend
const addFriend = async () => {
  if (newFriend.value.trim()) {
    try {
      const friendsCollection = collection($firestore, 'friends');
      await addDoc(friendsCollection, { name: newFriend.value.trim() });
      newFriend.value = ''; // Clear input field
      fetchFriends(); // Refresh the friends list
    } catch (error) {
      console.error('Error adding friend: ', error);
    }
  }
};

// Method to fetch friends from Firestore
const fetchFriends = async () => {
  try {
    const friendsCollection = collection($firestore, 'friends');
    const querySnapshot = await getDocs(friendsCollection);
    friends.value = querySnapshot.docs.map(doc => doc.data().name);
  } catch (error) {
    console.error('Error fetching friends: ', error);
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
}

.column {
  flex: 1;
  padding: 20px;
}

.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: grey;
  text-shadow: rgb(193, 57, 57);
}

.search-form {
  display: flex;
  width: 100%;
  max-width: 600px;
}

.search-input {
  flex: 1;
  color: black;
  padding: 12px;
  font-size: 1.2rem;
  border: 2px solid #2c3e50;
  border-right: none;
  border-radius: 4px 0 0 4px;
}

.search-button {
  padding: 12px 20px;
  font-size: 1.2rem;
  background-color: #2c3e50;
  color: white;
  border: 2px solid #2c3e50;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: #34495e;
}

.column.search {
  display: flex;
  justify-content: center; /* Horizontally center */
  align-items: center;     /* Vertically center */
  height: 80vh;           /* Make the column take up the full viewport height */
}

.search-container {
  text-align: center;      /* Center the text inside the container */
}

.friends-section {
  margin-top: 20px;
}

.friend-form {
  display: flex;
  margin-bottom: 20px;
}

.friend-input {
  flex: 1;
  padding: 12px;
  font-size: 1.2rem;
  border: 2px solid #2c3e50;
  border-right: none;
  border-radius: 4px 0 0 4px;
}

.friend-button {
  padding: 12px 20px;
  font-size: 1.2rem;
  background-color: #2c3e50;
  color: white;
  border: 2px solid #2c3e50;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.friend-button:hover {
  background-color: #34495e;
}

.friends-list {
  list-style-type: none;
  padding: 0;
}

.friends-list li {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
</style>
