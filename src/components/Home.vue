<template>
    <div class="w-full h-screen">
        <a href="https://github.com/SDEscobedo" class="absolute top-3 right-3 transition opacity-70 hover:opacity-50">
		    <svg class="w-8 fill-blue-800" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
	    </a>
        <div class="container h-10 mx-auto px-4 items-center content-center justify-center rounded bg-blue-200">
            <strong><h1 class="text-lg flex items-center justify-center w-full">Web Works 3D: A set of random three.js examples</h1></strong>
        </div>
        <ul class="sm:p-10 p-4 grid md:grid-cols-3 grid-cols-1 gap-8 min-h-[calc(100vh-48px-40px)]">
           
            <li class="rounded bg-gray-300" v-for="modelV in modelsV" :key="modelV">
                <router-link class="text-lg flex items-center justify-center p-8 h-full w-full transition hover:shadow-blue-500 hover:shadow-2xl" :to="`/v/${modelV}`">{{modelV.replaceAll("_", " ")}}</router-link>
            </li>
            <li class="rounded bg-blue-300" v-for="modelG in modelsG" :key="modelG">
                <router-link class="text-lg flex items-center justify-center p-8 h-full w-full transition hover:shadow-blue-500 hover:shadow-2xl" :to="`/p/${modelG}`">{{modelG.replaceAll("_", " ")}}</router-link>
            </li>
             <li class="rounded bg-gray-300" v-for="model in models" :key="model">
                <router-link class="text-lg flex items-center justify-center p-8 h-full w-full transition hover:shadow-blue-500 hover:shadow-2xl" :to="`/${model}`">{{model.replaceAll("_", " ")}}</router-link>
            </li>
        </ul>
        <Footer />
    </div>
</template>

<script>
import Footer from "./Footer.vue"
export default {
    name: "Home",
    data(){
        return{
            models: ["Sci-fi_Container_Game"],
            modelsV: ["cube"],
            modelsG: ["Geometry", "Particles"]
        }
    },
    components: { Footer },
}
</script>