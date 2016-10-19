<template>
  <div>
    <form novalidate @submit.prevent='logIt'>
      <date-time label='Start' :value.sync='start'></date-time>
      <date-time label='End' :value.sync='end'></date-time>

      <label for='client'>Client</label>
      <select id = 'client' v-model='client' style = 'display:block;'>
      <option v-for="option in clientOptions" v-bind:value="option">
          {{ option }}
      </option>
      </select>

      <label for='module'>Module</label>
      <select id = 'module' v-model='module' style = 'display:block;'>
        <option v-for="option in moduleOptions" v-bind:value="option">
          {{ option }}
        </option>
      </select>

      <label for='treatmentType'>TreatmentType</label>
      <select id = 'treatmentType' v-model='treatmentType' style = 'display:block;'>
        <option v-for="option in treatmentTypeOptions" v-bind:value="option">
          {{ option }}
        </option>
      </select>

      <div class='input-field'>
        <label for='label'>label</label>
        <input id='label' type='text' v-model='label'>
      </div>

      <div class='input-field'>
            <label for='what'>What?</label>
            <input id='what' type='text' v-model='what'>
      </div>

      <div class='row' v-if='saveState !== "saving"'>
        <input type='submit' class='waves-effect waves-light btn col s12' value='Log time'/>
      </div>
    </form>

    <div  v-if='saveState === "saving"'>
      <h4>Saving...</h4>
      <div class='progress'>
          <div class='indeterminate'></div>
      </div>
    </div>

    <div v-if='saveState === "error"' class='card-panel red-text'>
      <h4>Error...</h4>
      <pre><code>{{error}}</code></pre>
      <div>
        Refresh the page maybe?
      </div>
    </div>
    <div v-if='recordsState === "loaded"'>
      <table >
        <thead>
          <tr>
            <th data-field='start'>Start</th>
            <th data-field='end'>End</th>
            <th data-field='client'>client</th>
            <th data-field='module'>module</th>
            <th data-field='treatmentType'>treatmentType</th>
            <th data-field='label'>label</th>
            <th data-field='What?'>what
                   <a href='#' @click.prevent='refreshRecords' class='right' title='refresh'>&#x21bb;</a>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='record in displayedRecords'>
            <td>{{record[0]}}</td>
            <td>{{record[1]}}</td>
            <td>{{record[2]}}</td>
            <td>{{record[3]}}</td>
            <td>{{record[4]}}</td>
            <td>{{record[5]}}</td>
            <td>{{record[6]}}</td>
          </tr>
        </tbody>
      </table>
      <div class='fixed-action-btn' style='bottom: 12px; right: 12px;'>
        <a class='btn-floating btn-small red' :href='editLink' title='Edit records...' target='_blank'>
          <i class='small material-icons'>mode_edit</i>
        </a>
      </div>
    </div>

    <div v-if='recordsState === "loading"'>
      <h4>Loading records...</h4>
      <div class='progress'>
          <div class='indeterminate'></div>
      </div>
    </div>
  </div>
</template>

<script>
// This is the heart of the application. This file may not be the prettiest.
import appModel from './lib/appModel.js';
import {getError, logTime, getSheetTitle} from './lib/goog.js';
import {convertDateToSheetsDateString, getNow} from './lib/dateUtils.js';
import getLastRecordsForComponent from './lib/getLastRecordsForComponent.js';
import getSpreadsheetIdFromComponentRoute from './lib/getSpreadsheetIdFromComponentRoute.js';
import DateTime from './DateTime.vue';

export default {
  data() {
    return {
      recordsState: 'loading',
      displayedRecords: [],
      start: '',
      end: getNow(),
      client: '',
      clientOptions: [],
      module: '',
      moduleOptions: [],
      treatmentType: '',
      treatmentTypeOptions: [],
      label: '',
      what: '',
      saveState: '',
    };
  },
  computed: {
    /**
     * Provides a Google Docs link to edit a spreadsheet
     */
    editLink() {
      const sheetId = getSpreadsheetIdFromComponentRoute(this);
      return `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;
    }
  },
  components: {
    DateTime
  },
  route: {
    data() {
      appModel.pageName = 'Loading data...';

      getLastRecordsForComponent(this).then(() => {
        const sheetId = getSpreadsheetIdFromComponentRoute(this);
        getSheetTitle(sheetId, title => {
          appModel.pageName = title;
        });
      })
    }
  },

  methods: {
    refreshRecords() {
      getLastRecordsForComponent(this);
    },

    logIt() {
      this.saveState = 'saving';

      const start = convertDateToSheetsDateString(this.start);
      const end = convertDateToSheetsDateString(this.end);
      const spreadsheetId = getSpreadsheetIdFromComponentRoute(this);

      logTime(spreadsheetId, start, end, this.client, this.module,
      this.treatmentType, this.label, this.what)
        .then(() => {
          // TODO: This is not very reliable.
          this.displayedRecords.unshift([start, end, this.client,
          this.module, this.treatmentType, this.label, this.what]);
          this.start = this.end;
          this.end = getNow();
          this.client = '';
          // this.clientOptions = '';
          this.module = '';
          // this.moduleOptions = '';
          this.treatmentType = '';
          // this.treatmentTypeOptions = '';
          this.label = '';
          this.what = '';
          this.saveState = 'done';
          this.error = '';
        }, response => {
          this.saveState = 'error';
          this.error = getError(response);
        });
    },

  },

};
</script>
