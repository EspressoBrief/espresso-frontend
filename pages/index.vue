<template>
  <div>
    <Heading>Your Daily Briefing</Heading>
    <div v-if="events != undefined && events != null"
      class="grid grid-flow-row-dense auto-cols-max grid-cols-1 lg:grid-cols-3 gap-8">
      <UCard>
        <div class="flex">
          <IconText icon="i-mdi:alarm">{{ wake_up_time }}</IconText>
          <IconText icon="i-mdi:clock-alert-outline">{{ useDateFormat(events[0].commute.start, "HH:mm") }}
          </IconText>
        </div>
      </UCard>
      <UCard class="col-span-1 lg:col-span-2">
        <p class="max-w-prose">{{ general_ai_text }}</p>
      </UCard>
      <UCard v-for="event in events" class="col-span-full">
        <template #header>
          {{ event.title }}
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

const briefing_string = "3KtnLKu4JqedzAeIO4E1"

const get_total_commute_time = (event: any) => {
  let time = 0
  console.log(event)
  event.commute.forEach((step) => time += (step.end.getTime() - step.start.getTime()) / 1000)
  return time
}

const color_labels = ["red", "yellow", "green", "blue", "gray"]

const general_ai_text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam facilisis bibendum fringilla. Phasellus at metus sed nisi facilisis volutpat sit amet non massa. In hac habitasse platea dictumst. Pellentesque eu porta orci. Ut cursus dictum enim. Fusce id tortor ut neque pulvinar scelerisque. Maecenas ante justo, laoreet et urna in, lacinia sagittis sapien. Etiam dignissim urna arcu, non aliquet arcu sodales ut. Integer et lorem erat. Donec interdum lectus nec urna varius pulvinar. Duis viverra nisi commodo imperdiet scelerisque. Sed vel euismod massa. Nam rhoncus magna ut porttitor pharetra. Pellentesque ultricies diam vitae fermentum lobortis. "

const wake_up_time = "6:00"

const { data: events } = await useAsyncData(async () => {
  console.log("test")
  const db = getFirestore(useFirebaseApp())
  const docRef = doc(db, "users", "user1", "briefings", briefing_string)
  const user = await getDoc(docRef)
  console.log(user.data())
  console.log(user.exists())
  const data = user.data().events.map((event: any) => {
    return {
      title: event.calendar.name,
      ai_suggestion: event.info,
      weather: { condition: event.weather.WeatherText, temperature: event.weather.Temperature.Metric.Value },
      calendar: { start: new Date(event.calendar.start.seconds * 1000), end: new Date(event.calendar.end.seconds * 1000) },
      commute: event.commute.routes[0].legs[0].steps.filter((step) => step.transitDetails != undefined).map((step) => {
        return {
          description: step.transitDetails.stopDetails.departureStop.name + " -> " + step.transitDetails.stopDetails.arrivalStop.name,
          start: new Date(step.transitDetails.stopDetails.departureTime),
          end: new Date(step.transitDetails.stopDetails.arrivalTime)
        }
      })
    }
  })
  console.log(data)
  console.log("test2")
  console.log(data)
  console.log(typeof data[0].calendar.start)
  return data
})

</script>
