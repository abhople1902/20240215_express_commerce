// const fs = require('fs');
// const path = require('path');

// const dataFolderPath = '/Users/abhople/Documents/20240215_express_commerce';

// // Ensure the data folder exists
// if (!fs.existsSync(dataFolderPath)) {
//     fs.mkdirSync(dataFolderPath);
// }

// // Helper function to generate a unique ID for a new record
// function generateUniqueId(table) {
//     const filePath = path.join(dataFolderPath, `${table}.json`);
//     if (!fs.existsSync(filePath)) {
//         return 1;
//     }

//     const data = JSON.parse(fs.readFileSync(filePath));
//     const lastId = data[data.length - 1].id;
//     return lastId + 1;
// }

// // Function to add a new record to a table
// function addToTable(table, record) {
//     const filePath = path.join(dataFolderPath, `${table}.json`);
//     const data = JSON.parse(fs.readFileSync(filePath));
//     record.id = generateUniqueId(table);
//     data.push(record);
//     fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
// }

// // Function to retrieve all records from a table
// function getAllFromTable(table) {
//     const filePath = path.join(dataFolderPath, `${table}.json`);
//     if (!fs.existsSync(filePath)) {
//         return [];
//     }
//     return JSON.parse(fs.readFileSync(filePath));
// }

// // Function to retrieve a record by ID from a table
// function getByIdFromTable(table, id) {
//     const filePath = path.join(dataFolderPath, `${table}.json`);
//     if (!fs.existsSync(filePath)) {
//         return null;
//     }
//     const data = JSON.parse(fs.readFileSync(filePath));
//     return data.find(record => record.id === id);
// }

// // Function to update a record in a table
// function updateInTable(table, id, newData) {
//     const filePath = path.join(dataFolderPath, `${table}.json`);
//     if (!fs.existsSync(filePath)) {
//         return false;
//     }
//     const data = JSON.parse(fs.readFileSync(filePath));
//     const index = data.findIndex(record => record.id === id);
//     if (index !== -1) {
//         data[index] = { ...data[index], ...newData };
//         fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
//         return true;
//     }
//     return false;
// }

// // Function to delete a record from a table
// function deleteFromTable(table, id) {
//     const filePath = path.join(dataFolderPath, `${table}.json`);
//     if (!fs.existsSync(filePath)) {
//         return false;
//     }
//     const data = JSON.parse(fs.readFileSync(filePath));
//     const newData = data.filter(record => record.id !== id);
//     if (newData.length !== data.length) {
//         fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
//         return true;
//     }
//     return false;
// }

// // Create the initial JSON files for products and orders if they don't exist
// const initialProductsData = [];
// const initialOrdersData = [];
// fs.writeFileSync(path.join(dataFolderPath, 'products.json'), JSON.stringify(initialProductsData, null, 2));
// fs.writeFileSync(path.join(dataFolderPath, 'orders.json'), JSON.stringify(initialOrdersData, null, 2));

// module.exports = {
//     addToTable,
//     getAllFromTable,
//     getByIdFromTable,
//     updateInTable,
//     deleteFromTable
// };




// Description: File I/O operations using Node.js

//Current bug - let the user decide the update parameters
//              make cases 6 and 7 more robust
//              The file name not getting updated properly when directory name is updated; new file in one level up is created
const fs = require('fs');
const path = require('path');
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const mainDirPath = '/Users/abhople/Documents/20240209_/';
const directoryPath = '/Users/abhople/Documents/20240209_/testDir';
const newDirname = 'newtestDir';
let DirFlag = false
let fileFlag = false

/**
 * Function to check if a directory exists
 * @param {String} directoryPath
 * @return {Boolean}
*/
function directoryExists(directoryPath) {
  try {
    return fs.statSync(directoryPath).isDirectory();
  } catch (err) {
    return false;
  }
}

/**
 * Function to check if file exists
 * @param {String} filePath 
 * @returns {Boolean}
 */
function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}


////////  CREATE OPERATIONS
/**
 * Function to create a directory
 * @param {String} directoryPath 
 * @returns {void}
 */
function createDirectory(directoryPath) {
  if (directoryExists(directoryPath)) {
    console.log(`Directory '${directoryPath}' already exists.`);
  } else {
    fs.mkdir(directoryPath, { recursive: true }, (err) => {
      if (err) {
        console.error(`Error creating directory: ${err}`);
      } else {
        console.log(`Directory '${directoryPath}' created successfully.`);
      }
    });
  }
}

/**
 * Function to create an empty file inside a directory
 * @param {String} directoryPath 
 * @param {String} fileName 
 * @returns {void}
 */
function createFile(directoryPath, fileName) {
  const filePath = path.join(directoryPath, fileName);
  if (fileExists(filePath)) {
    console.log(`File '${fileName}' already exists in directory '${directoryPath}'.`);
  } else {
    fs.open(filePath, 'w', (err, fd) => {
      if (err) {
        console.error(`Error creating file: ${err}`);
      } else {
        fs.close(fd, (err) => {
          if (err) {
            console.error(`Error closing file: ${err}`);
          } else {
            console.log(`Empty file '${fileName}' created successfully in directory '${directoryPath}'.`);
          }
        });
      }
    });
  }
}



/**
 * 
 * Function to prompt user for JSON schema input
 */
function promptForSchema() {
  return new Promise((resolve, reject) => {
    rl.question('Please enter the JSON schema: ', (input) => {
      try {
        const schema = JSON.parse(input);
        resolve(schema);
      } catch (error) {
        reject('Invalid JSON schema. Please try again.');
      }
    });
  });
}

// Function to create JSON schema (file content)
async function createSchema() {
  try {
    const schema = await promptForSchema();
    let schemaFilePath = ""
    // Save the schema to a JSON file
    if(fileFlag){
      if(DirFlag){
        schemaFilePath = mainDirPath + newDirname + '/newTest.json';
      } else {
        schemaFilePath = directoryPath + '/newTest.json';
      }
    } else {
      if(DirFlag){
        schemaFilePath = mainDirPath + newDirname + '/test.json';
      } else {
        schemaFilePath = directoryPath + '/test.json';
      }
    }
    fs.writeFileSync(schemaFilePath, JSON.stringify(schema, null, 2));

    console.log(`Schema successfully created and saved to ${schemaFilePath}`);
  } catch (error) {
    console.error(error);
  } finally {
    console.log("Schema written")
  }
}













/////////////// READ OPERATION
/**
 * Function to read JSON data from a file
 * @param {String} filePath
 * @param {String} name
 * @returns {Object}
 * @returns {null}
 */
function readJsonFile(filePath, name) {
  try {
    const jsonData = fs.readFile(filePath, 'utf8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error(`Error reading JSON file: ${error}`);
    return null;
  }
}

/**
 * Function to read orders status by id
 * @param {String} filePath 
 * @param {String} id
 * @returns {Object}
 * @returns {null}
 */
function readOrderStatus(orderId, callback) {
  const orderFilePath = path.join('/Users/abhople/Documents/20240215_express_commerce/', 'orders.json');
  fs.readFile(orderFilePath, 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading order file:', err);
          callback(null);
          return;
      }
      try {
          const orders = JSON.parse(data);
          const order = orders.find(order => order.order_id === orderId);
          if (order) {
              callback(order);
          } else {
              callback(null);
          }
      } catch (parseError) {
          console.error('Error parsing order data:', parseError);
          callback(null);
      }
  });
}
















/////////////// UPDATE OPERATION
/**
 * Updating directory name
 * @param {String} directoryPath 
 * @param {String} newDirName 
 * @returns {void}
 */
function updateDirectoryName(directoryPath, newDirName) {
  fs.renameSync(directoryPath, newDirName);
  console.log(`Directory name updated to ${newDirName}`);
}

/**
 * updating file name
 * @param {String} existingFilePath 
 * @param {String} newFileName 
 * @returns {void}
 */
function updateFileName(existingFilePath, newFileName) {
  fs.renameSync(existingFilePath, newFileName);
  console.log(`File name updated to ${newFileName}`);
}



/**
 * Updating file content
 * Appending in the file
 * @param {String} filePath
 * @param {String} content
 * @returns {void}
 */
async function appendSchema() {
  try {
    const schema = await promptForSchema();
    let schemaFilePath = ""
    // Save the schema to a JSON file
    if(fileFlag){
      if(DirFlag){
        schemaFilePath = mainDirPath + newDirname + '/newTest.json';
      } else {
        schemaFilePath = directoryPath + '/newTest.json';
      }
    } else {
      if(DirFlag){
        schemaFilePath = mainDirPath + newDirname + '/test.json';
      } else {
        schemaFilePath = directoryPath + '/test.json';
      }
    }
    fs.appendFileSync(schemaFilePath, JSON.stringify(schema, null, 2));

    console.log(`Schema successfully updated and saved to ${schemaFilePath}`);
  } catch (error) {
    console.error(error);
  } finally {
    console.log("Schema written")
  }
}


/**
 * Updating file keys
 * @param {String} filePath
 * @param {Object} keysToUpdate
 * @returns {void}
 */
function updateJsonKeys(filePath, keysToUpdate) {
  try {
    let jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Update values of specific keys
    for (let key in keysToUpdate) {
      if (jsonData.hasOwnProperty(key)) {
        jsonData[key] = keysToUpdate[key];
      } else {
        console.log(`Key '${key}' not found in JSON data.`);
      }
    }

    // Write updated JSON data back to file
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
    console.log(`JSON keys updated successfully in ${filePath}`);
  } catch (error) {
    console.error(`Error updating JSON keys: ${error}`);
  }
}


/**
 * Updating file values
 * @param {String} filePath
 * @param {Object} keyValuesToUpdate
 * @returns {void}
 */
function updateJsonValues(filePath, keyValuesToUpdate) {
  try {
    let jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Updating specific values of particular keys
    for (let key in keyValuesToUpdate) {
      if (jsonData.hasOwnProperty(key)) {
        // Checking if the key exists in the provided object and update its value
        if (keyValuesToUpdate[key].hasOwnProperty('value')) {
          jsonData[key] = keyValuesToUpdate[key]['value'];
        } else {
          console.log(`Value not provided for key '${key}'. Skipping update.`);
        }
      } else {
        console.log(`Key '${key}' not found in JSON data.`);
      }
    }

    // Writing updated JSON data back to file
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
    console.log(`JSON keys updated successfully in ${filePath}`);
  } catch (error) {
    console.error(`Error updating JSON keys: ${error}`);
  }
}







//////////////// DELETION OPERATION
/**
 * Deletes a file from the specified directory
 * @param {String} directoryPath 
 * @param {String} fileName
 * return {void}
 */
function deleteFile(directoryPath, fileName) {
  const filePath = path.join(directoryPath, fileName);
  if (fileExists(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${err}`);
      } else {
        console.log(`File '${fileName}' deleted successfully from directory '${directoryPath}'.`);
      }
    });
  } else {
    console.log(`File '${fileName}' does not exist in directory '${directoryPath}'.`);
  }
}


/**
 * Deletes a folder and its contents
 * @param {String} folderPath
 * return {void}
 */
function deleteFolder(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file, index) => {
      const curPath = `${folderPath}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolder(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
    console.log(`Folder ${folderPath} deleted successfully.`);
  } else {
    console.log(`Folder ${folderPath} does not exist.`);
  }
}





module.exports = {
  directoryExists,
  fileExists,
  createDirectory,
  createFile,
  createSchema,
  readJsonFile,
  readOrderStatus,
  updateDirectoryName,
  updateFileName,
  appendSchema,
  updateJsonKeys,
  updateJsonValues,
  deleteFile,
  deleteFolder,
  rl,
  DirFlag,
  fileFlag,
  mainDirPath,
  directoryPath,
  newDirname
}
