<template>
  <v-container class="pa-0" style="background-color: #121212;">
    <v-stepper v-model="e1">
      <v-stepper-header flat style="box-shadow: none">
        <v-stepper-step :complete="e1 > 1" step="1"
          >Tournament type</v-stepper-step
        >
        <v-divider></v-divider>
        <v-stepper-step :complete="e1 > 2" step="2"> Country </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="e1 > 3" step="3"> Startdate </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="created" step="4"> Summary </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1" justify="center" style="padding-top: 0px">
          <v-card flat class="mb-12" color="transparent" height="200">
            <v-card-text style="height: 100%">
              <v-container  >
                
                  <v-row class="text-center" justify="center">
                    <v-col cols="12" xs="12" sm="12" md="6">
                      Select type of tournament
                    </v-col>
                  </v-row>
                  <v-row class="text-center" justify="center">
                    <v-col cols="10" xs="10" sm="10" md="4">
                      <v-select
                        v-model="tournamentType"
                        :items="tournamentTypes"
                        label="Tournament type"
                        item-text="type"
                        item-value="index"
                        dense
                        outlined
                      ></v-select>
                      {{ tournamentTypeErr }}
                    </v-col>
                  </v-row>
                
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn text @click="cancel()"> Cancel </v-btn>
              <v-btn color="primary" @click="step()"> Next </v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="2" style="padding-top: 0px">
          <v-card flat class="mb-12" color="transparent" height="150">
            <v-card-text style="height: 100%">
              <v-container>
                <div>
                  <v-row class="text-center" align="center" justify="center">
                    <v-col cols="12" xs="12" sm="12" md="6">
                      Select country
                    </v-col>
                  </v-row>
                  <v-row class="text-center" align="center" justify="center">
                    <v-col cols="12" xs="12" sm="12" md="6">
                      <v-select
                        v-model="country"
                        :items="countries"
                        item-text="fullName"
                        item-value="shortCode"
                        label="Country"
                        dense
                        outlined
                      ></v-select>
                      {{ countryErr }}
                    </v-col>
                  </v-row>
                </div>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn text @click="e1 = 1"> Back </v-btn>
              <v-btn color="primary" @click="step()"> Next </v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="3" style="padding-top: 0px">
          <v-card flat class="mb-12" color="transparent" height="150">
            <v-card-text style="height: 100%">
              <v-container>
                <div>
                  <v-row class="text-center" justify="center" align="center">
                    <v-col cols="12" xs="12" sm="12" md="6">
                      Select startdate
                    </v-col>
                  </v-row>
                  <v-row class="text-center" justify="center" align="center">
                    <v-col cols="12" xs="12" sm="12" md="6">
                      <v-dialog
                        ref="dialog"
                        v-model="dateModal"
                        :return-value.sync="picker"
                        persistent
                        width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="picker"
                            label="Startdate"
                            readonly
                            outlined
                            dense
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                          {{ pickerErr }}
                        </template>
                        <v-date-picker v-model="picker" :min="today">
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="dateModal = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.dialog.save(picker)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-dialog>
                    </v-col>
                  </v-row>
                </div>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn text @click="e1--"> Back </v-btn>
              <v-btn color="primary" @click="step()"> Next </v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="4" justify="center" style="padding-top: 0px">
          <v-card flat class="mb-12" color="transparent" height="150">
            <v-card-text style="height: 100%" justify="center">
              <v-container v-if="creating" fill-height>
                <v-row class="text-center" justify="center" align="center">
                  <v-col cols="12" xs="12" sm="12" md="6">
                    <v-progress-circular
                      :size="100"
                      color="primary"
                      indeterminate
                      >Creating tournament</v-progress-circular
                    >
                  </v-col>
                </v-row>
              </v-container>

              <v-container v-else-if="created" fill-height>
                <v-row class="text-center" justify="center" align="center">
                  <v-col cols="12" xs="12" sm="12" md="6">
                    <h2>{{ tournament.name }}</h2>
                    <p>has been succesfully created</p>
                  </v-col>
                </v-row>
              </v-container>

              <v-container v-else fill-height>
                <v-row class="text-center" justify="center" align="center">
                  <v-col cols="12" xs="12" sm="12" md="6">
                    <p>Summary</p>
                    <h3>{{ tournament.name }}</h3>
                    <p style="color: white">{{ getDate(tournament.date) }}</p>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn
                v-if="created"
                class="mx-2"
                color="primary"
                depressed
                @click="done()"
              >
                Done
              </v-btn>
              <v-btn v-if="!creating && !created" text @click="e1 = 3">
                Back
              </v-btn>
              <v-btn
                v-if="!creating && !created"
                color="primary"
                @click="createTournament()"
              >
                Create
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
import { tournamentsCollection } from "@/firebase";
export default {
  name: "AddTournament",
  data() {
    return {
      e1: 1,
      creating: false,
      created: false,
      dateModal: false,
      picker: "",
      today: new Date().toISOString().substr(0, 10),
      tournamentType: "",
      country: "",
      tournament: {},
      tournamentTypes: [
        {
          index: 1,
          type: "Normal",
        },
        {
          index: 2,
          type: "One day",
        },
        {
          index: 3,
          type: "Challenge day",
        },
        {
          index: 4,
          type: "Test tournament",
        },
      ],
      countries: [
        {
          fullName: "Netherlands",
          shortCode: "nl",
          championship: "DSA",
        },
        {
          fullName: "Norway",
          shortCode: "no",
          championship: "NSA",
        },
        {
          fullName: "Italy",
          shortCode: "it",
          championship: "ISA",
        },
        {
          fullName: "France",
          shortCode: "fr",
          championship: "FSA",
        },
        {
          fullName: "United States",
          shortCode: "us",
          championship: "USSA",
        },
        {
          fullName: "United Kingdom",
          shortCode: "gb",
          championship: "UKSA",
        },
        {
          fullName: "Brasil",
          shortCode: "br",
          championship: "BSA",
        },
      ],
      tournamentTypeErr: "",
      countryErr: "",
      pickerErr: "",
    };
  },
  methods: {
    step() {
      if (this.e1 == 1) {
        if (!this.tournamentType) {
          this.tournamentTypeErr =
            "You have to select a tournament type before you can proceed.";
        } else {
          this.tournamentTypeErr = "";
          this.e1++;
        }
      } else if (this.e1 == 2) {
        if (!this.country) {
          this.countryErr =
            "You have to select a country before you can proceed.";
        } else {
          this.countryErr = "";
          this.e1++;
        }
      } else if (this.e1 == 3) {
        if (!this.picker) {
          this.pickerErr =
            "You have to select a startdate before you can proceed.";
        } else {
          this.pickerErr = "";
          // Op dit punt weten we zeker dat alle benodigde informatie aanwezig is.
          // Tournament object samenstellen
          let tournamentName = "";
          let tournamentDate = new Date(this.picker);
          let year = tournamentDate.getFullYear();
          let championship = this.countries.find(
            (country) => country.shortCode === this.country
          ).championship;
          switch (this.tournamentType) {
            case 1:
              tournamentName += championship + " " + year;
              break;
            case 2:
              tournamentName +=
                championship +
                " " +
                this.tournamentTypes[this.tournamentType - 1].type +
                " " +
                year;

              break;
            case 3:
              tournamentName += this.tournamentTypes[this.tournamentType - 1]
                .type;
              break;
            case 4:
              tournamentName += this.tournamentTypes[this.tournamentType - 1]
                .type;
              break;
            default:
              tournamentName += "Fun tournament";
              break;
          }
          // console.log(championship)
          let tournament = {
            name: tournamentName,
            startdate: tournamentDate,
            country: this.country,
            state: { code: "ofs", text: "Open for subscription" },
          };
          this.tournament = tournament;
          this.e1++;
        }
      }
    },
    getDate(date) {
      return date ? date.toLocaleDateString() : "";
    },
    createTournament() {
      this.creating = true;
      // Tournament opslaan in de firestore
      tournamentsCollection.add(this.tournament).then(() => {
        this.created = true;
        this.creating = false;
      });
    },
    done() {
      this.$emit("onSuccess");
      // Reset alles
      this.e1 = 1;
      this.creating = false;
      this.created = false;
      this.dateModal = false;
      this.picker = "";
      this.tournamentType = "";
      this.country = "";
      this.tournament = {};
    },
    cancel() {
      this.$emit("onCancel");
    },
  },
};
</script>
