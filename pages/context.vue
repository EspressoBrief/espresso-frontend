<template>
  <div>
    <Heading>Tell your AI agent a bit about yourself</Heading>
    <div v-if="questions.length > 0" class="flex flex-col">
      <p class="text-2xl font-bold pb-4">{{ questions[0] }}</p>
      <UForm ref="form" :state="state" @submit="onSubmit" class="space-y-4">
        <UFormGroup>
          <UInput v-model="state.answer" />
        </UFormGroup>
        <div class="flex space-x-4">
          <UButton color="red" @click="skipQuestion()">Don't answer</UButton>
          <UButton type="submit">
            Submit
          </UButton>
        </div>
      </UForm>
    </div>
    <div v-else>
      <p class="text-2xl font-bold pb-4">You're all caught up!</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
let state = reactive({
  answer: undefined
})

const form = ref()

let questions = $ref(["Do you mind getting a bit wet in the rain?", "How much time do you need for getting up?"])
const onSubmit = (event: any) => {
  questions = questions.filter(q => q != questions[0])
  state = {
    answer: undefined
  }
}

const skipQuestion = () => {
  state = {
    answer: undefined
  }
  questions = questions.filter(q => q != questions[0])
}
</script>
