<template>
  <div>
    <Heading>Your Daily Briefing</Heading>
    <div v-if="data.events != undefined && data.events != null"
      class="grid grid-flow-row-dense auto-cols-max grid-cols-1 lg:grid-cols-4 gap-4">
      <UCard class="col-span-2 flex flex-col justify-center">
        <div class="flex justify-between items-center">
          <div></div>
          <div class="flex items-center">
            <Icon name="i-mdi:alarm" size="48px" class="mr-4" />
            <span class="font-bold text-2xl">{{ data.wake_up_time }}</span>
          </div>
          <div class="flex items-center">
            <Icon name="i-mdi:walk" size="48px" class="mr-4" />
            <span class="font-bold text-2xl">{{
              useDateFormat(data?.events[0].commute[0].start, "HH:mm")
            }}</span>
          </div>
          <div></div>
        </div>
      </UCard>
      <UCard class="col-span-1 lg:col-span-2">
        <p class="max-w-prose">{{ data.general_info }}</p>
      </UCard>
      <UCard class="lg:col-span-2">
        <div class="flex flex-col items-center">
          <Icon name="i-mdi:newspaper-variant-multiple-outline" size="36px" class="mb-2" />
          <NuxtLink v-for="headline in data.headlines" :href="headline.link" class="w-full hover:text-">
            <UAlert :key="headline.title" :description="headline.snippet" :title="headline.title" class="my-2" />
          </NuxtLink>
        </div>
      </UCard>
      <UCard class="col-span-1 lg:col-span-2">
        <div class="flex flex-col items-center">
          <Icon name="i-mdi:checkbox-marked-circle-outline" size="48px" class="mb-2" />
          <UAlert v-for="todo in data.todos" :description="todo.comment" :title="todo.title" :key="todo.title"
            class="my-2" />
        </div>
      </UCard>
      <UCard v-for="event in data.events" class="col-span-full">
        <template #header>
          <div class="flex items-center">
            <Icon name="i-mdi:alert" class="mr-2" style="color: yellow" v-if="event.problem" />
            <p class="">{{ event.title }}</p>
          </div>
        </template>

        <div class="flex">
          <IconText icon="i-mdi:clock-time-three-outline">{{ useDateFormat(event.calendar.start, "HH:mm") }} - {{
            useDateFormat(event.calendar.end, 'HH:mm') }}
          </IconText>
          <IconText v-if="event.calendar.location != ''" icon="i-mdi:map-marker">{{ event.calendar.location }}
          </IconText>
          <IconText icon="i-mdi:weather-cloudy">{{ event.weather.condition }}</IconText>
          <IconText icon="i-mdi:thermometer">{{ event.weather.temperature }}°C</IconText>
        </div>

        <IconText v-if="event.ai_suggestion != ''" icon="i-mdi:exclamation-thick" class="max-w-prose">{{
          event.ai_suggestion }}
        </IconText>

        <template #footer>
          <UMeterGroup size="lg" :min="0" :max="get_total_commute_time(event)">
            <template #indicator>
              {{ (get_total_commute_time(event) / 60) }} min
            </template>
            <UMeter v-for="(step, index) in event.commute" :value="(step.end.getTime() - step.start.getTime()) / 1000"
              :label="step.description" :color="color_labels[index]" />
          </UMeterGroup>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getFirestore, doc, getDoc, collection, getDocs } from "firebase/firestore/lite";

const briefing_id = "briefing1"

const get_total_commute_time = (event: any) => {
  let time = 0
  console.log(event)
  event.commute.forEach((step) => time += (step.end.getTime() - step.start.getTime()) / 1000)
  return time
}

const color_labels = ["red", "yellow", "green", "blue", "gray"]

const { data } = await useAsyncData(async () => {
  console.log("test")
  const db = getFirestore(useFirebaseApp())
  const docRef = doc(db, "users", "user1", "briefings", briefing_id)
  const briefing = await getDoc(docRef)
  console.log(briefing.data())
  console.log(briefing.exists())
  const events = briefing.data().events.map((event: any) => {
    return {
      title: event.calendar.name,
      ai_suggestion: event.info,
      weather: { condition: event.weather.WeatherText, temperature: event.weather.Temperature.Metric.Value },
      calendar: { start: new Date(event.calendar.start.seconds * 1000), end: new Date(event.calendar.end.seconds * 1000), location: event.calendar.location },
      problem: event.problem == "True",
      commute: event.commute.routes[0].legs[0].steps.filter((step) => step.transitDetails != undefined).map((step) => {
        return {
          description: step.transitDetails.stopDetails.departureStop.name + "  ⇨  " + step.transitDetails.stopDetails.arrivalStop.name,
          start: new Date(step.transitDetails.stopDetails.departureTime),
          end: new Date(step.transitDetails.stopDetails.arrivalTime)
        }
      })
    }
  })
  const out = { events: events, general_info: briefing.data().info, todos: briefing.data().relevant_todos, headlines: briefing.data().headlines, wake_up_time: briefing.data().time_to_stand_up }
  console.log(out)
  return out
})

</script>
