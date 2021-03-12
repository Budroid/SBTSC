<template>
  <v-card flat height="250">
    <v-card-text style="padding-bottom: 0px">
      <v-container fill-height>
        <v-row>
          <v-col cols="12" xs="12" sm="12" md="6">
             
            <v-radio-group v-model="permissionLevel">
              <v-radio label="Admin" :value="3"></v-radio>
              <v-radio label="Teamcaptain" :value="2"></v-radio>
              <v-radio label="Member" :value="1"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="cancel()"> Cancel </v-btn>
      <v-btn
        @click="modifyUser()"
        color="primary"
        :disabled="permissionLevel == initialValue"
      >
        Change
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "ModifyUser",
  data: () => ({
    permissionLevel: 0,
    initialValue: 0,
  }),
  created() {
    this.permissionLevel = this.user.customClaims.permissionLevel;
    this.initialValue = this.user.customClaims.permissionLevel;
  },
  methods: {
    cancel() {
      this.$emit("onCancel");
    },
    modifyUser() {
      console.log(`Permission level van ${this.user.uid} moet naar ${this.permissionLevel}`);
    },
  },
  props: {
    user: Object,
  },
};
</script>
