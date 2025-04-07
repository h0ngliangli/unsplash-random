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
    <div class="title">
      {{ refModel.description }}
    </div>
    <!-- <img :src="refModel.url" class="wallpaper" /> -->
    <div class="desc">
      <div v-if="refModel.errorCode === 0">
        <div class="flex flex-row align-items-center gap-1">
          <img :src="refModel.userprofileUrl" width="24px" />
          <p>
            {{ refModel.username }}
          </p>
        </div>
        <div class="flex flex-row align-items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M4.536 5.778a5 5 0 0 1 7.07 0q.275.274.708.682q.432-.408.707-.682a5 5 0 0 1 7.125 7.016L13.02 19.92a1 1 0 0 1-1.414 0L4.48 12.795a5 5 0 0 1 .055-7.017z"
              stroke-width="0.5"
              stroke="currentColor"
            />
          </svg>
          <p>{{ refModel.likes }}</p>
        </div>
      </div>
      <div v-else>
        <p>Error: {{ refModel.errorCode }} {{ refModel.errorMessage }}</p>
      </div>
      <p>Next in {{ refModel.countDown }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@mixin abs-transparent {
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  color: white;
  font-family: "Courier New";
  font-size: 20px;
  margin: 5px;
  position: absolute;
  padding: 10px;
}

.wallpaper {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  height: 100vh;
  width: 100vw;
}

.title {
  @include abs-transparent;
  left: 0;
  text-align: center;
  top: 0;
}

.desc {
  @include abs-transparent;
  bottom: 40px;
  right: 20px;
  text-align: left;
  font-size: 14px;
}
</style>
