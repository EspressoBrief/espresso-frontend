<template>
  <div>
    <Heading>Your Daily Briefing</Heading>
    <div class="grid grid-flow-row-dense auto-cols-max grid-cols-1 lg:grid-cols-3 gap-8">
      <UCard>
        <div class="flex">
          <IconText icon="i-mdi:alarm">{{ wake_up_time }}</IconText>
          <IconText icon="i-mdi:clock-alert-outline">{{ useDateFormat(events[0].commute.parts[0].start, "HH:mm") }}
          </IconText>
        </div>
      </UCard>
      <UCard class="col-span-1 lg:col-span-2">
        <p class="max-w-prose">{{ general_ai_text }}</p>
      </UCard>
      <UCard v-for="event in events" class="col-span-full">
        <template #header>
          {{ event.calendar.title }}
        </template>

        <div class="flex">
          <IconText icon="i-mdi:clock-time-three-outline">{{ useDateFormat(event.calendar.start, "HH:mm") }} - {{
            useDateFormat(event.calendar.end, 'HH:mm') }}
          </IconText>
          <IconText icon="i-mdi:map-marker">{{ event.calendar.location }}</IconText>
          <IconText icon="i-mdi:weather-cloudy">{{ event.weather.conditions }}</IconText>
          <IconText icon="i-mdi:thermometer">{{ event.weather.temperature }}°C</IconText>
        </div>

        <IconText icon="i-mdi:exclamation-thick" class="max-w-prose">{{ event.info }}</IconText>

        <template #footer>
          <UMeterGroup size="lg" :min="0" :max="get_total_commute_time(event)">
            <template #indicator>
              {{ (get_total_commute_time(event) / 60) }} min
            </template>
            <UMeter v-for="(part, index) in event.commute.parts"
              :value="(part.end.getTime() - part.start.getTime()) / 1000" :label="part.description"
              :color="color_labels[index]" />
          </UMeterGroup>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CalendarEntry, CommuteEntry, CommutePart, Event, WeatherEntry } from "~/utils/Event"

const get_total_commute_time = (event: Event) => {
  let time = 0
  event.commute.parts.forEach((part) => time += (part.end.getTime() - part.start.getTime()) / 1000)
  return time
}

const color_labels = ["red", "yellow", "green", "blue", "gray"]

const general_ai_text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam facilisis bibendum fringilla. Phasellus at metus sed nisi facilisis volutpat sit amet non massa. In hac habitasse platea dictumst. Pellentesque eu porta orci. Ut cursus dictum enim. Fusce id tortor ut neque pulvinar scelerisque. Maecenas ante justo, laoreet et urna in, lacinia sagittis sapien. Etiam dignissim urna arcu, non aliquet arcu sodales ut. Integer et lorem erat. Donec interdum lectus nec urna varius pulvinar. Duis viverra nisi commodo imperdiet scelerisque. Sed vel euismod massa. Nam rhoncus magna ut porttitor pharetra. Pellentesque ultricies diam vitae fermentum lobortis. "

const wake_up_time = "6:00"
const events: Event[] = [new Event(new CalendarEntry("First Event", new Date(2024, 9, 28, 8), new Date(2024, 9, 28, 10), "Somewhere"), new WeatherEntry(12, "cloudy"), new CommuteEntry([new CommutePart(new Date(2024, 9, 28, 7, 30), new Date(2024, 9, 28, 7, 50), "Walking"), new CommutePart(new Date(2024, 9, 28, 7, 50), new Date(2024, 9, 28, 8), "Train")]), "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras interdum vitae dolor sed facilisis.")]

</script>
