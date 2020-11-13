<template>
    <div class="container">
        <header class="my-3">
            <h1>Registrar nuevo cliente</h1>
        </header>
        <main>
            <FormNewClient/>
        </main>
    </div>
</template>

<script>
import FormNewClient from '@/components/clients/FormNewClient';
export default {
    name:'NewClient',
    components:{FormNewClient}
}
</script>

<style>

</style>