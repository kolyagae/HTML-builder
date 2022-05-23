//----------modules-----------
const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

//---------path--------------
const PATH_DIR_PROJECT_COMPONENTS = path.join(__dirname, 'project-dist');
const PATH_TEMPLATE_HTML = path.join(__dirname, 'template.html');
const PATH_BASIC_DIR_COMPONENTS = path.join(__dirname, 'components');
const PATH_BASIC_DIR_STYLES = path.join(__dirname, 'styles');
const PATH_BASIC_DIR_ASSETS = path.join(__dirname, 'assets');
const PATH_CLONE_DIR_ASSETS = path.join(PATH_DIR_PROJECT_COMPONENTS, 'assets');


//-----------getHtml--------------
async function getHtmlFile () {
  const READ_TEMPLATE_HTML = await fsPromises.readFile(PATH_TEMPLATE_HTML, 'utf-8');
  const READ_BASIC_DIR_COMPONENTS = await fsPromises.readdir(PATH_BASIC_DIR_COMPONENTS, {withFileTypes: true});
  let copyTemplateHtml = READ_TEMPLATE_HTML;

  for (let component of READ_BASIC_DIR_COMPONENTS) {
    let componentName = path.parse(component.name).name;
    if (component.isFile() && path.parse(component.name).ext === '.html') {
      let readComponent = await fsPromises.readFile(path.join(PATH_BASIC_DIR_COMPONENTS, component.name), 'utf-8');
      copyTemplateHtml = copyTemplateHtml.replace(new RegExp (`{{${componentName}}}`), readComponent);
    }
  }

  await fsPromises.mkdir(PATH_DIR_PROJECT_COMPONENTS, {recursive: true});
  await fsPromises.writeFile(path.join(PATH_DIR_PROJECT_COMPONENTS, 'index.html'), copyTemplateHtml);
  await getStyles ();
}
getHtmlFile();

//-----------getCssStyles--------------
async function getStyles () {
  const READ_DIR_STYLES = await fsPromises.readdir(PATH_BASIC_DIR_STYLES, {withFileTypes: true});
  const STYLE_CSS = await fs.createWriteStream(path.join(PATH_DIR_PROJECT_COMPONENTS, 'style.css'));
  for (let file of READ_DIR_STYLES) {
    if (file.isFile() && path.parse(file.name).ext === '.css') {
      const stream = fs.createReadStream(path.join(PATH_BASIC_DIR_STYLES, file.name), 'utf-8');
      stream.on('data', chunk => STYLE_CSS.write(chunk));
      stream.on('error', error => console.log('Error', error.message));
    }
  }
}

//----------copy assets----------------
async function getCopyDir (path1, path2) {
  await fsPromises.rm(path2, {force: true, recursive: true});
  await fsPromises.mkdir(path2, {recursive: true});
  const READ_DIR_ASSETS = await fsPromises.readdir(path1, {withFileTypes: true});

  for (let file of READ_DIR_ASSETS) {
    if (file.isFile()) {
      await fsPromises.copyFile(path.join(path1, file.name), path.join(path2, file.name));
    }
    else {
      await getCopyDir(path.join(path1, file.name), path.join(path2, file.name));
    }
  }
}
getCopyDir(PATH_BASIC_DIR_ASSETS, PATH_CLONE_DIR_ASSETS);
