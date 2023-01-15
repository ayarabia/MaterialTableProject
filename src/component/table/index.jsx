import React, { useEffect, useState } from "react";
import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import axios from 'axios'
function TableCom() {
const columns = [ 
//   {
//   title: "Avatar",
//   field: "avatar",
//  render: (rowData) => {
//     const styles = { width: 40, borderRadius: "50%" };
//     return <img src={rowData.avatar} style={styles} alt="avaterImg"/>;
//   }},
  { title: "Id", field: "id" },
    { title: "Firstname", field: "first_name"},
    { title: "Lastname", field: "last_name"},
    { title: "Gender", field: "gender"},
    { title: "Email", field: "email",  },
  ];
const [data, setData] = useState([]);
const headerStyle ={
  backgroundColor: "#3A4F7A",
  color: '#FFF',
  padding:"30px",
  fontStyle:"italic",
fontWeight:"bold",
fontSize:"19px"
}

  useEffect(() => {
    const fetchData =() => {
   let users = localStorage.getItem("users");
   if (users) {
      users = JSON.parse(users);
      setData(users)
    } else{
      axios
      .get("https://random-data-api.com/api/v2/users?size=9&is_json=true")
      .then(data => {
        setData(data.data)
        localStorage.setItem("users", JSON.stringify(data.data));
      })
      .catch(error => {console.log(error)
    });
    }
};
    fetchData();
  }, []);
return (
    <div className="container"> 
      <MaterialTable  
       title="User Information"
      options={{
      filtering: true,
      // Activate sorting functionality, display arrow icon when hovering header
      sorting: true,
      maxColumnSort: 'all_columns',
      defaultOrderByCollection: [
        { orderBy: 1, orderDirection: "asc", sortOrder: 1 },
        { orderBy: 2, orderDirection: "desc", sortOrder: 2 },
      ],
      grouping: true,
      exportButton: true,
       exportMenu: [
          {
            label: "Export PDF",
          exportFunc: (cols, datas) => ExportPdf(cols, datas, "myPdfFileName"),
          },
          // {
          //   label: "Export CSV",
          //   exportFunc: (cols, datas) => ExportCsv(cols, datas, "myCsvFileName"),
          // },
        ],
        rowStyle: (data,index)=>index % 2 ===0?{backgroundColor: "#FEA1BF", padding:"50px"}
          :{backgroundColor: "#FFC6D3", padding:"50px"},
          headerStyle: headerStyle
    }} columns={columns} 
      data={data}
      editable={{
        onRowUpdate: (newData, oldData) => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              let test =localStorage.getItem("users")
              console.log(test);
              const dataUpdate = [...data];
              const target = dataUpdate.find(
                (el) => el.id === oldData.id
              );
              const index = dataUpdate.indexOf(target);
              dataUpdate[index] = newData;
           // localStorage.setItem("users", JSON.stringify([...dataUpdate]));
              setData([...dataUpdate]);
              resolve();
            }, 1000);
          });
        },
      
        onRowDelete: (oldData) => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataDelete = [...data];
              const target = dataDelete.find(
                (el) => el.id === oldData.id
              );
              const index = dataDelete.indexOf(target);
              dataDelete.splice(index, 1);
              localStorage.setItem("users", JSON.stringify([...dataDelete]));
              setData([...dataDelete]);
              resolve();
            }, 1000);
          });
        },
      }}
      />
    </div>
  );
}

export default TableCom;
