<script setup>
import { onMounted, ref } from "vue"
const refData = ref("loading...")

const load = async () => {
  console.log("Loading...")
  const response = await fetch("https://api.unsplash.com/photos/random", {
    headers: {
      Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
    },
  })
  if (!response.ok) {
    console.error("Error fetching data:", response.statusText)
    return
  }
  const data = await response.json()
  console.log(data)
  refData.value = data
}
onMounted(async () => {
  await load()
  setInterval(async () => {
    await load()
  }, 2 * 60 * 1000)
})
</script>

<template>
  <div>
    <img
      :src="refData.urls?.full"
      alt="Random Unsplash Image"
      class="wallpaper"
    />
    <div class="desc">
      <h1>{{ refData?.description }}</h1>
      <p>By {{ refData?.user?.name }}</p>
      <p>Likes: {{ refData?.likes }}</p>
      <p>Views: {{ refData?.views }}</p>
      <p>Downloads: {{ refData?.downloads }}</p>
    </div>
  </div>
</template>

<style scoped>
.wallpaper {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
}
.desc {
  /* position this to the top left */
  position: absolute;
  top: 0;
  left: 0;
  max-width: 20%;
  color: white;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 10px;
  font-size: 20px;
  font-family: "Courier New", Courier, monospace;
  text-align: left;
}
</style>
