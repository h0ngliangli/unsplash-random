<script setup>
import { onMounted, ref } from "vue"
import config from "./config.js"

const refModel = ref({
  countDown: config.intervalSeconds,
  description: "",
  url: "/default.jpg",
  username: "",
  userprofileUrl: "",
  likes: 0,
  views: 0,
  downloads: 0,
  errorCode: 0,
  errorMessage: "",
})

//

// 读取随机图片
const reload = async () => {
  const counter = setInterval(() => {
    refModel.value.countDown--
    if (refModel.value.countDown <= 0) {
      clearInterval(counter)
      refModel.value.countDown = config.intervalSeconds
      reload()
    }
  }, 1000)
  const response = await fetch("https://api.unsplash.com/photos/random", {
    headers: {
      Authorization: `Client-ID ${config.unsplashAccessKey}`,
    },
  })
  if (!response.ok) {
    refModel.value.errorCode = response.status
    refModel.value.errorMessage = response.statusText
    // console.error("Error fetching data:", response.statusText)
    return
  }
  refModel.value.errorCode = 0
  refModel.value.errorMessage = ""
  const data = await response.json()
  // console.log(data)
  refModel.value.description = data.description || data.alt_description || ""
  refModel.value.url = data.urls.full
  refModel.value.username = data.user.name
  refModel.value.userprofileUrl = data.user.profile_image.medium
  refModel.value.likes = data.likes
  refModel.value.views = data.views
  refModel.value.downloads = data.downloads
  refModel.value.countDown = config.intervalSeconds
}
onMounted(async () => {
  reload()
})
</script>

<template>
  <div>
    <div
      class="wallpaper"
      :style="{ backgroundImage: 'url(' + refModel.url + ')' }"
    ></div>
    <!-- <img :src="refModel.url" class="wallpaper" /> -->
    <div class="desc">
      <div v-if="refModel.errorCode === 0">
        <h1>{{ refModel.description }}</h1>
        <p>
          By <img :src="refModel.userprofileUrl" width="16px" />
          {{ refModel.username }}
        </p>
        <p>Likes: {{ refModel.likes }}</p>
        <p>Views: {{ refModel.views }}</p>
        <p>Downloads: {{ refModel.downloads }}</p>
      </div>
      <div v-else>
        <p>Error: {{ refModel.errorCode }} {{ refModel.errorMessage }}</p>
      </div>
      <p>Next in {{ refModel.countDown }}</p>
    </div>
  </div>
</template>

<style scoped>
.wallpaper {
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
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
.desc h1 {
  font-size: 20px;
}

.desc p {
  font-size: 14px;
  margin: 0;
}
</style>
