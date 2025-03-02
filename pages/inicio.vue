<script lang="ts" setup>
import { ref } from 'vue';
import { VListItemSubtitle } from 'vuetify/components';

export interface Character {
info: Info;
results: Result[];
}

export interface Info {
count: number;
pages: number;
next: string;
prev: null;
}

export interface Result {
id: number;
name: string;
status: string;
species: string;
type: string;
gender: string;
origin: Location;
location: Location;
image: string;
episode: string[];
url: string;
created: Date;
}

export interface Location {
name: string;
url: string;
}

const { data } = await useFetch<Character>('https://rickandmortyapi.com/api/character');

const characters = ref<Result[]>(data.value?.results || []);
const newCharacter = ref<Result>({
id: 0,
name: '',
status: '',
species: '',
type: '',
gender: '',
origin: { name: '', url: '' },
location: { name: '', url: '' },
image: '',
episode: [],
url: '',
created: new Date(),
});
const editCharacterData = ref<Result>({
id: 0,
name: '',
status: '',
species: '',
type: '',
gender: '',
origin: { name: '', url: '' },
location: { name: '', url: '' },
image: '',
episode: [],
url: '',
created: new Date(),
});
const isEditing = ref(false);
const addDialog = ref(false);
const editDialog = ref(false);
const expandedCharacter = ref<number | null>(null);

const addCharacter = () => {
newCharacter.value.id = characters.value.length + 1;
characters.value.push({ ...newCharacter.value });
resetNewCharacterForm();
addDialog.value = false;
};

const updateCharacter = () => {
const index = characters.value.findIndex(c => c.id === editCharacterData.value.id);
if (index !== -1) {
    characters.value[index] = { ...editCharacterData.value };
}
resetEditCharacterForm();
editDialog.value = false;
};

const editCharacter = (character: Result) => {
editCharacterData.value = { ...character };
isEditing.value = true;
editDialog.value = true;
};

const deleteCharacter = (id: number) => {
characters.value = characters.value.filter(c => c.id !== id);
};

const resetNewCharacterForm = () => {
newCharacter.value = {
    id: 0,
    name: '',
    status: '',
    species: '',
    type: '',
    gender: '',
    origin: { name: '', url: '' },
    location: { name: '', url: '' },
    image: '',
    episode: [],
    url: '',
    created: new Date(),
};
};

const resetEditCharacterForm = () => {
editCharacterData.value = {
    id: 0,
    name: '',
    status: '',
    species: '',
    type: '',
    gender: '',
    origin: { name: '', url: '' },
    location: { name: '', url: '' },
    image: '',
    episode: [],
    url: '',
    created: new Date(),
};
isEditing.value = false;
};

const toggleExpand = (id: number) => {
expandedCharacter.value = expandedCharacter.value === id ? null : id;
};

</script>
<template>
<v-container fluid>
<div>
    <v-row justify="center">
    <v-col cols="auto">
        <v-btn color="primary" @click="addDialog = true">Nuevo personaje</v-btn>
    </v-col>
    </v-row>
    <v-row>
    <v-col v-for="item in characters" :key="item.id">
        <v-card class="mx-auto" max-width="344">
        <v-img height="200px" :src="item.image" cover></v-img>
        <v-card-title>{{ item.name }}</v-card-title>
        <v-card-subtitle>{{ item.species }}</v-card-subtitle>
        <v-card-actions>
            <v-btn color="blue" @click="editCharacter(item)">Editar</v-btn>
            <v-btn color="red" @click="deleteCharacter(item.id)">Eliminar</v-btn>
            <v-btn icon @click="toggleExpand(item.id)">
            <v-icon>{{ expandedCharacter === item.id ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
        </v-card-actions>
        <v-expand-transition>
            <div v-if="expandedCharacter === item.id">
            <v-card-text>
                <p><strong>Género:</strong> {{ item.gender }}</p>
                <p><strong>Especie:</strong> {{ item.species }}</p>
                <p><strong>Estado:</strong> {{ item.status }}</p>
                <p><strong>Origen:</strong> {{ item.origin.name }}</p>
            </v-card-text>
            </div>
        </v-expand-transition>
        </v-card>
    </v-col>
    </v-row>
    
    <!-- Dialogo para agregar personaje -->
    <v-dialog v-model="addDialog" max-width="500px">
    <v-card>
        <v-card-title>
        <span class="headline">Agregar Personaje</span>
        </v-card-title>
        <v-card-text>
        <v-form @submit.prevent="addCharacter">
            <v-text-field v-model="newCharacter.name" label="Nombre del personaje" required></v-text-field>
            <v-text-field v-model="newCharacter.gender" label="Genero" required></v-text-field>
            <v-text-field v-model="newCharacter.species" label="Especie" required></v-text-field>
            <v-text-field v-model="newCharacter.status" label="Estado" required></v-text-field>
            <v-text-field v-model="newCharacter.origin" label="Origen" required></v-text-field>
            <v-btn type="submit" color="primary">Agregar Personaje</v-btn>
        </v-form>
        </v-card-text>
        <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" @click="addDialog = false">Cancelar</v-btn>
        </v-card-actions>
    </v-card>
    </v-dialog>
    
    <!-- Dialogo para editar personaje -->
    <v-dialog v-model="editDialog" max-width="500px">
    <v-card>
        <v-card-title>
        <span class="headline">Actualizar Personaje</span>
        </v-card-title>
        <v-card-text>
        <v-form @submit.prevent="updateCharacter">
            <v-text-field v-model="editCharacterData.name" label="Nombre del personaje" required></v-text-field>
            <v-text-field v-model="editCharacterData.status" label="Estado" required></v-text-field>
            <v-text-field v-model="editCharacterData.species" label="Especie" required></v-text-field>
            <v-text-field v-model="editCharacterData.origin" label="Origen" required></v-text-field>
            <v-btn type="submit" color="primary">Actualizar Personaje</v-btn>
        </v-form>
        </v-card-text>
        <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" @click="editDialog = false">Cancelar</v-btn>
        </v-card-actions>
    </v-card>
    </v-dialog>
</div>
</v-container>
</template>