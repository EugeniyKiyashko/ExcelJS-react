import React from 'react';
import 'devextreme/data/odata/store';
import DataGrid, {
  Column,
  Pager,
  Paging,
  FilterRow,
  Lookup,
  Export
} from 'devextreme-react/data-grid';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import { exportDataGrid } from 'devextreme/exporter/exceljs/excelExporter';

export default class extends React.Component {

  dataSource = {
    store: {
      type: 'odata',
      key: 'Task_ID',
      url: 'https://js.devexpress.com/Demos/DevAV/odata/Tasks'
    },
    expand: 'ResponsibleEmployee',
    select: [
      'Task_ID',
      'Task_Subject',
      'Task_Start_Date',
      'Task_Due_Date',
      'Task_Status',
      'Task_Priority',
      'Task_Completion',
      'ResponsibleEmployee/Employee_Full_Name'
    ]
  };

  priorities = [
    { name: 'High', value: 4 },
    { name: 'Urgent', value: 3 },
    { name: 'Normal', value: 2 },
    { name: 'Low', value: 1 }
  ];

  render() {
    return (
      <React.Fragment>
        <h2 className={'content-block'}>Display Data</h2>

        <DataGrid
          className={'dx-card wide-card'}
          dataSource={this.dataSource}
          showBorders={false}
          focusedRowEnabled={true}
          defaultFocusedRowIndex={0}
          columnAutoWidth={true}
          onExporting={this.onExporting}
          columnHidingEnabled={true}
        >
          <Paging defaultPageSize={10} />
          <Pager showPageSizeSelector={true} showInfo={true} />
          <FilterRow visible={true} />

          <Column dataField={'Task_ID'} width={90} hidingPriority={2} />
          <Column
            dataField={'Task_Subject'}
            width={190}
            caption={'Subject'}
            hidingPriority={8}
          />
          <Column
            dataField={'Task_Status'}
            caption={'Status'}
            hidingPriority={6}
          />
          <Column
            dataField={'Task_Priority'}
            caption={'Priority'}
            hidingPriority={5}
          >
            <Lookup
              dataSource={this.priorities}
              valueExpr={'value'}
              displayExpr={'name'}
            />
          </Column>
          <Column
            dataField={'ResponsibleEmployee.Employee_Full_Name'}
            caption={'Assigned To'}
            allowSorting={false}
            hidingPriority={7}
          />
          <Column
            dataField={'Task_Start_Date'}
            caption={'Start Date'}
            dataType={'date'}
            hidingPriority={3}
          />
          <Column
            dataField={'Task_Due_Date'}
            caption={'Due Date'}
            dataType={'date'}
            hidingPriority={4}
          />
          <Column
            dataField={'Task_Priority'}
            caption={'Priority'}
            hidingPriority={1}
          />
          <Column
            dataField={'Task_Completion'}
            caption={'Completion'}
            hidingPriority={0}
          />
          <Export enabled={true} />
        </DataGrid>
      </React.Fragment>
    );
  }

  onExporting(e) {
    var workbook = new ExcelJS.Workbook();
    var worksheet = workbook.addWorksheet('Sheet name');

    exportDataGrid({
      component: e.component,
      worksheet: worksheet,
      topLeftCell: { row: 3, column: 3 }
    }).then(function() {
      workbook.xlsx.writeBuffer().then(function(buffer) {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'XLSX-datagrid.xlsx');
      });
    });
    e.cancel = true;
  }
};
