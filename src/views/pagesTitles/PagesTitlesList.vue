<template>
        
      <div>
        <h1>PAGES HEADERS</h1>
        <div class="main">
          <div>
            <img src="./settings.png" width="500px"/>
          </div>
          <div>
            <img src="./settings2.png" width="500px"/>
          </div>

    <v-data-table
      v-if="elements.length"
      :headers="[
        { text: 'ID', value: 'id' },
        { text: 'NAME', value: 'name' },
        { text: 'EDIT', value: 'actions', sortable: false },
      ]"
      :items="elements"
    >
    <template v-slot:item.actions="{ item }">
        <v-btn text @click="edit(item)" color="info">edit</v-btn>
      </template>
      
    </v-data-table>
    <v-dialog
      v-model="dialog.edit"
      v-if="selected!=null"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Edit Page text
        </v-card-title>

        <v-card-text>
            <div style="width:100%; text-align:center">
                <v-text-field v-model="selected.name" label="Target pages" disabled></v-text-field> 
            </div>
            <div v-for="(item,key) in selected.data" :key="key">
                <div style="display:inline-block; width: 80%;">
                <v-text-field :value="item" @input="valueOnChange($event,key)" label="Title "></v-text-field>
                </div>
                <div style="display:inline-block; width: 20%;">
                    <!-- <v-btn
                        color="delete"
                        icon
                        small
                        @click="deleteDot(key)"
                    >
                        <v-icon>delete</v-icon>
                    </v-btn> -->
                </div>
            </div>
          <!-- <div style="display:inline-block; width: 80%;">
            <v-text-field v-model="new_dot" label="New title"></v-text-field>
            </div> -->
          <!-- <div style="display:inline-block; width: 20%;">
            <v-btn
            color="success"
            icon
            small
            @click="addNewDot"
          >
            <v-icon>add</v-icon>
          </v-btn></div> -->
          <!--<v-text-field v-model="selected.geo" label="Geolocation"></v-text-field>
          <v-text-field v-model="selected.geo_full" label="Full geolocation"></v-text-field>
          <v-text-field v-model="selected.pass" label="Pass"></v-text-field>
          <v-switch v-model="selected.hidden" label="Hidden"></v-switch> -->
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            color="success"
            icon
            small
            @click="save"
          >
            <v-icon>save</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <!-- <v-btn
            color="success"
            flat
            @click="update"
          >
            Update
          </v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
      </div>
</template>
<script>
export default {
    data() {
        return {
            elements:null,
            dialog: {
                edit: false,
            },
            selected: null,
            new_dot: null,
        }
    },
    methods:{
        valueOnChange(e,key)
        {
            this.selected.data[key]=e;
            console.log(this.selected.data[key])
        },
        sync() {
            axios.get('/admin/pagestitles/getTitlesForAdmin').then(res => {
                this.elements = res.data.data;
             });
        },
        deleteDot(key){
            this.selected.data.splice(key, 1);
            axios.post('/admin/pagestitles/saveTitleForAdmin', this.selected).then(res => {
                console.log(res.data.data)
             });
        },
        edit(item)
        {
            console.log(item);
            this.selected = item;
            console.log(this.selected)
            this.dialog.edit = true;
        },
        save()
        {
            axios.post('/admin/pagestitles/saveTitleForAdmin', this.selected).then(res => {
                console.log(res.data.data)
             });
             this.selected = null;
             this.dialog.edit = false;
             this.sync();
        },
        addNewDot()
        {
            let array = Array();
            array.push(this.new_dot)
            if(this.selected.data=='' || this.selected.data==null)
            {
                this.selected.data = array;
            }
            else
            {
                this.selected.data.push(this.new_dot);
            }
            this.new_dot = null;
        }
    },
    mounted(){
        this.sync();
    }
}
</script>
<style lang="scss" scoped>
    .main{
        text-align: center;
    }
</style>