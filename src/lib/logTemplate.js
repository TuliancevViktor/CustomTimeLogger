/**
 * This is a template for the default spreadsheet.
 */
export default function createLogTemplate(name) {
  return {
    properties: {
      title: `${name}`,
    },
    sheets: createTimeSheet('Time Log')
  }
}

function createTimeSheet(title) {
  return {
    properties: {
      title,
      gridProperties: {
        // We want the first row to be frozen
        frozenRowCount: 1,
        // And we need only first three columns (start/end/what)
        frozenColumnCount: 7,
      },
    },
    data: [createHeaderRow()]
  };
}

function createHeaderRow() {
  return {
    startRow: 0,
    startColumn: 0,
    rowData: {
      values: [
        header('Start'),
        header('End'),
        header('Client'),
        header('Module'),
        header('Treatment type'),
        header('Label'),
        header('What?'),
        header('ClientOptions'),
        header('ModuleOptions'),
        header('Treatment type Options')
      ]
    }
  };
}

function header(text) {
  return {
    userEnteredValue: {
      stringValue: text
    },
    userEnteredFormat: {
      horizontalAlignment: 'CENTER',
      textFormat: {
        bold: true,
      },
    },
  };
}
