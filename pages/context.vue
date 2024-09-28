<template>
  <div>
    <Heading>Tell your AI agent a bit about yourself</Heading>
    <div v-if="questions[0]" class="flex flex-col">
      <p class="text-2xl font-bold pb-4">{{ questions[0].question }}</p>
      <p class="pb-4">{{ questions[0].description }}</p>
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
import { getFirestore, doc, getDoc, collection, getDocs, deleteDoc, addDoc } from "firebase/firestore/lite";

let state = reactive({
  answer: undefined
})

const form = ref()

const db = getFirestore(useFirebaseApp())

let questionsRef = await getDocs(collection(db, "users", "user1", "context_requests"))

let { data: questions, refresh } = $(await useAsyncData(async () => {
  let questions: { description: String, question: String, id: String }[] = []
  questionsRef.forEach((doc) => {
    questions.push({ description: doc.data().description, question: doc.data().question, id: doc.id })
  })
  console.log("loading questions", questions)
  return questions
}))

const onSubmit = async (event: any) => {
  await addDoc(collection(db, "users", "user1", "context"), { question: questions[0].question, answer: state.answer })
  await deleteDoc(doc(db, "users/" + "user1/" + "context_requests/" + questions[0].id))
  state = {
    answer: undefined
  }
  console.log("submitted")
  // refresh()
  window.location.reload();
}

const skipQuestion = async () => {
  state = {
    answer: undefined
  }
  await deleteDoc(doc(db, "users/" + "user1/" + "context_requests/" + questions[0].id))
  console.log("skipped")
  // refresh()
  window.location.reload();
}
</script>
