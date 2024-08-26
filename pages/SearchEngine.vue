<template>
  <div class="container">

    <!-- For the checking progress and tallying search -->
    <div class="column blank">
      <div class="content">
        <h1 class="md-title">Topics Covered Today</h1>
      <div class="housing">
          <ul >
            <li>
              <p v-if="sent_query">You searched {{ sent_query }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>

  <!-- Handles the search enginge -->
  <div class="column search">
    <div class="search-container">
      <h1 class="title">Earn & Learn</h1>
      <form class="search-form" @submit.prevent="handleSearch">
        <input v-model="query" type="text" :placeholder="placeholderMessage" class="search-input" />
        <button type="submit" class="search-button">Search</button>
      </form>
    </div>
  </div>

  <!-- Manages Friends List -->
  <div class="column friends">
    <div class="friends-section">
      <form @submit.prevent="addFriend" class="friend-form">
        <input v-model="newFriend" type="text" placeholder="Add a friend" class="friend-input" />
        <button type="submit" class="friend-button">Add Friend</button>
      </form>
      <ul class="friends-list">
        <li v-for="friend in friends" :key="friend">
          {{ friend }}
        </li>
      </ul>
    </div>
  </div>

  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs, updateDoc, arrayUnion, doc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { useNuxtApp } from '#app';
import { getAuth } from '@firebase/auth'; // Import Firebase Auth

// Data variables
const query = ref('');
const sent_query = ref('');
const placeholderMessage = ref('');
const newFriend = ref('');
const friends = ref<string[]>([]);
const $firestore = getFirestore();

// Array of placeholder messages
const placeholders = [
  'Search for jobs, learning resources...',
  'Find your next career opportunity...',
  'Explore new learning materials...',
  'Discover jobs and educational resources...'
];

// Method to handle the search logic
const handleSearch = () => {
  if (query.value) {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query.value)}`;
    window.open(searchUrl, '_blank');

    sent_query.value = query.value;
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
const addFriend = async () => {  // Get Firestore instance
  const auth = getAuth();
  const newF = newFriend.value.trim()

  // Ensure the new friend input is not empty
  if (newF) {
    try {
      const userId = auth?.currentUser?.uid;
      if (userId) {
        const userDocRef = doc($firestore, 'users', userId);
        await updateDoc(userDocRef, {
          friends: arrayUnion(newF)
        });
        newFriend.value = '';
        fetchFriends();
      } else {
        console.error('User is not logged in');
      }
    } catch (error) {
      console.error('Error adding friend: ', error);
    }
  }
};

// Method to fetch friends from Firestore
const fetchFriends = async () => {
  try {
    const friendsCollection = collection($firestore, 'users');
    const querySnapshot = await getDocs(friendsCollection);
    friends.value = querySnapshot.docs.flatMap(doc => doc.data().friends || []);
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

.column.blank {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40vh;
}

.content {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #151515;
  border-radius: 8px;
  background-color: #fff;
}

.housing {
  margin-top: 20px;
}

.housing ul {
  list-style-type: none;
  padding-left: 0;
}

.housing ul li {
  padding: 10px;
  background-color: #eef;
  margin-bottom: 10px;
  border-radius: 4px;
}

.housing ul li p {
  margin: 0;
  color: #555;
  font-size: 16px;
}

.column {
  flex: 1;
  padding: 10px;
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
  color: #151515;
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
  justify-content: center;
  align-items: center;
  height: 60vh;
}

.search-container {
  text-align: center;
  /* Center the text inside the container */
}

.column.friends{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40vh;
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
