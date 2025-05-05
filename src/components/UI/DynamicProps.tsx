// import { useConfig } from "../../context/ConfigContext";

// import {
//   Box,
//   TextField,
//   Select,
//   MenuItem,
//   Button,
//   Tooltip,
//   FormControl,
//   InputLabel,
//   IconButton,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// const DynamicProps: React.FC = () => {
//   const { config, setConfig } = useConfig();

//   const handleKeyChange = (index: number, newKey: string) => {
//     if (config.some((item, i) => i !== index && item.key === newKey)) {
//       alert("Такий ключ вже існує!");
//       return;
//     }
//     const updatedConfig = [...config];
//     updatedConfig[index].key = newKey;
//     setConfig(updatedConfig);
//   };

//   const handleValue1Change = (index: number, newValue: string) => {
//     const updatedConfig = [...config];
//     updatedConfig[index].value1 = newValue;
//     setConfig(updatedConfig);
//   };

//   const handleValue2Change = (index: number, newValue: string) => {
//     const updatedConfig = [...config];
//     updatedConfig[index].value2 = newValue;
//     setConfig(updatedConfig);
//   };

//   const handleFunctionChange = (index: number, newFunction: string) => {
//     const updatedConfig = [...config];
//     updatedConfig[index].function = newFunction;
//     setConfig(updatedConfig);
//   };

//   const addNewProp = () => {
//     setConfig((prevConfig) => [...prevConfig, { key: "", function: "" }]);
//   };

//   const removeProp = (index: number) => {
//     const updatedConfig = config.filter((_, i) => i !== index);
//     setConfig(updatedConfig);
//   };

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//       {config.map((item, index) => (
//         <Box
//           key={index}
//           sx={{
//             position: "relative",
//             display: "flex",
//             flexDirection: "column",
//             gap: 1,
//             border: "2px solid #ccc",
//             padding: 1,
//             paddingTop: 3,
//           }}
//         >
//           <IconButton
//             size="small"
//             onClick={() => removeProp(index)}
//             sx={{
//               position: "absolute",
//               top: 0,
//               right: 0,
//               width: 20,
//               height: 20,
//             }}
//           >
//             <CloseIcon />
//           </IconButton>
//           <FormControl fullWidth>
//             <InputLabel>Function</InputLabel>
//             <Select
//               label="Function"
//               value={item.function}
//               onChange={(e) => handleFunctionChange(index, e.target.value)}
//               size="small"
//               fullWidth
//             >
//               <MenuItem value="discount">
//                 <Tooltip
//                   title="Функція розрахунку знижки (discount)"
//                   placement="right"
//                 >
//                   <span>Discount</span>
//                 </Tooltip>
//               </MenuItem>
//               <MenuItem value="format">
//                 <Tooltip title="Функція форматування ціни" placement="right">
//                   <span>Format</span>
//                 </Tooltip>
//               </MenuItem>

//               <MenuItem value="dynamicImgs">
//                 <Tooltip
//                   title="Функція додавання динамічних зображень"
//                   placement="right"
//                 >
//                   <span>Dynamic Imgs</span>
//                 </Tooltip>
//               </MenuItem>
//             </Select>
//           </FormControl>

//           <TextField
//             label="Key"
//             value={item.key}
//             onChange={(e) => handleKeyChange(index, e.target.value)}
//             // disabled
//             size="small"
//           />

//           {item.function === "discount" && (
//             <TextField
//               label="price"
//               value={item.value1}
//               onChange={(e) => handleValue1Change(index, e.target.value)}
//               size="small"
//             />
//           )}

//           {item.function === "discount" && (
//             <TextField
//               label="sale_price"
//               value={item.value2 || ""}
//               onChange={(e) => handleValue2Change(index, e.target.value)}
//               size="small"
//             />
//           )}
//         </Box>
//       ))}
//       <Button variant="outlined" onClick={addNewProp}>
//         додати змінну
//       </Button>
//     </Box>
//   );
// };

// export default DynamicProps;
