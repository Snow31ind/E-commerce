import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import NextLink from "next/link";
import React, { useEffect, useContext, useReducer } from "react";
import {
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  ListItemText,
  TextField,
  CircularProgress,
  MenuList,
  MenuItem,
  ListItemIcon,
  Divider,
  Paper,
} from "@mui/material";
import {
  GroupOutlined,
  HomeOutlined,
  ProductionQuantityLimitsOutlined,
  SummarizeOutlined,
} from "@mui/icons-material";
import { getError } from "../../../utils/errors";
import { Store } from "../../../utils/Store";
import Layout from "../../../layouts/Layout";
import { useStyles } from "../../../utils/styles";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true, errorUpdate: "" };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, errorUpdate: "" };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
}

const isSSD = [
  {
    value: "Available",
    label: "AVAILABLE",
  },
  {
    value: "Not available",
    label: "NOT AVAILABLE",
  },
];

function ProductEdit({ params }) {
  const productId = params.id;
  const { state } = useContext(Store);
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const classes = useStyles();
  const { user } = state;

  useEffect(() => {
    if (!user) {
      return router.push("/login");
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: "FETCH_REQUEST" });
          const { data } = await axios.get(`/api/admin/products/${productId}`, {
            headers: { authorization: `Bearer ${user.token}` },
          });
          dispatch({ type: "FETCH_SUCCESS" });
          setValue("category", data.category);
          setValue("name", data.name);
          setValue("slug", data.slug);
          setValue("images", data.images);
          setValue("brand", data.brand);
          setValue("oldPrice", data.oldPrice);
          setValue("price", data.price);
          setValue("countInStock", data.countInStock);
          setValue("processorName", data.processorAndMemory.processorName);
          setValue(
            "processorVariant",
            data.processorAndMemory.processorVariant
          );
          setValue("ram", data.processorAndMemory.ram);
          setValue("ssd", data.processorAndMemory.ssd);
          setValue("ssdCapacity", data.processorAndMemory.ssdCapacity);
          setValue(
            "graphicProcessor",
            data.processorAndMemory.graphicProcessor
          );
          setValue("weight", data.dimensions.weight);
          setValue("screenSize", data.displayAndAudio.screenSize);
        } catch (err) {
          dispatch({ type: "FETCH_FAIL", payload: getError(err) });
        }
      };
      fetchData();
    }
  }, []);

  const uploadHandler = async (e, imageField = "images") => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post("/api/admin/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${user.token}`,
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });
      setValue(imageField, data.secure_url);
      enqueueSnackbar("File uploaded successfully", { variant: "success" });
    } catch (err) {
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  const submitHandler = async ({
    category,
    name,
    slug,
    images,
    brand,
    oldPrice,
    price,
    countInStock,
    processorName,
    processorVariant,
    ram,
    ssd,
    ssdCapacity,
    graphicProcessor,
    weight,
    screenSize,
  }) => {
    closeSnackbar();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/admin/products/${productId}`,
        {
          category,
          name,
          slug,
          images,
          brand,
          oldPrice,
          price,
          countInStock,
          processorName,
          processorVariant,
          ram,
          ssd,
          ssdCapacity,
          graphicProcessor,
          weight,
          screenSize,
        },
        { headers: { authorization: `Bearer ${user.token}` } }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      enqueueSnackbar("Product updated successfully", { variant: "success" });
      router.push("/admin/products");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  return (
    <Layout title={`Edit Product ${productId}`}>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Paper className={classes.section}>
            <MenuList>
              <MenuItem>
                <ListItemIcon>
                  <HomeOutlined />
                </ListItemIcon>
                <NextLink href="/admin/dashboard" passHref>
                  <ListItemText>Admin Dashboard</ListItemText>
                </NextLink>
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon>
                  <SummarizeOutlined fontSize="small" />
                </ListItemIcon>
                <NextLink href="/admin/orders" passHref>
                  <ListItemText>Orders</ListItemText>
                </NextLink>
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon>
                  <ProductionQuantityLimitsOutlined fontSize="small" />
                </ListItemIcon>
                <NextLink href="/admin/products" passHref>
                  <ListItemText>Products</ListItemText>
                </NextLink>
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon>
                  <GroupOutlined fontSize="small" />
                </ListItemIcon>
                <NextLink href="/admin/users" passHref>
                  <ListItemText>Users</ListItemText>
                </NextLink>
              </MenuItem>
            </MenuList>
          </Paper>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography variant="h3">Edit Product {productId}</Typography>
              </ListItem>
              <ListItem>
                {loading && <CircularProgress></CircularProgress>}
                {error && (
                  <Typography className={classes.error}>{error}</Typography>
                )}
              </ListItem>
              <ListItem>
                <form
                  onSubmit={handleSubmit(submitHandler)}
                  className={classes.form}
                >
                  <List>
                    <ListItem>
                      <Controller
                        name="category"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="category"
                            label="Category"
                            error={Boolean(errors.category)}
                            helperText={
                              errors.category ? "Category is required" : ""
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="name"
                            label="Name"
                            error={Boolean(errors.name)}
                            helperText={errors.name ? "Name is required" : ""}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="slug"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="slug"
                            label="Slug"
                            error={Boolean(errors.slug)}
                            helperText={errors.slug ? "Slug is required" : ""}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="images"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="images"
                            label="Image"
                            error={Boolean(errors.image)}
                            helperText={errors.image ? "Image is required" : ""}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Button variant="contained" component="label">
                        Upload File
                        <input type="file" onChange={uploadHandler} hidden />
                      </Button>
                      {loadingUpload && <CircularProgress />}
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="brand"
                        control={control}
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="brand"
                            label="Brand"
                            error={Boolean(errors.brand)}
                            helperText={errors.brand ? "Brand is required" : ""}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="oldPrice"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="oldPrice"
                            label="Old Price"
                            error={Boolean(errors.oldPrice)}
                            helperText={
                              errors.oldPrice ? "Old Price is required" : ""
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="price"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="price"
                            label="Price"
                            error={Boolean(errors.price)}
                            helperText={errors.price ? "Price is required" : ""}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="countInStock"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="countInStock"
                            label="Count in stock"
                            error={Boolean(errors.countInStock)}
                            helperText={
                              errors.countInStock
                                ? "Count in stock is required"
                                : ""
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="processorName"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="processorName"
                            label="Processor Name"
                            error={Boolean(errors.processorName)}
                            helperText={
                              errors.processorName
                                ? "Processor Name is required"
                                : ""
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="processorVariant"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="processorVariant"
                            label="Processor Variant"
                            error={Boolean(errors.processorVariant)}
                            helperText={
                              errors.processorVariant
                                ? "Processor Variant is required"
                                : ""
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="ram"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="ram"
                            label="RAM"
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="ssd"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            select
                            value={isSSD}
                            id="ssd"
                            label="Is SSD Available?"
                            {...field}
                          >
                            {isSSD.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="ssdCapacity"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="ssdCapacity"
                            label="SSD Capacity"
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="graphicProcessor"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="graphicProcessor"
                            label="Graphic Processor"
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="weight"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="weight"
                            label="Weight"
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="screenSize"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="screenSize"
                            label="Screen Size"
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        color="primary"
                      >
                        Update
                      </Button>
                      {loadingUpdate && <CircularProgress />}
                    </ListItem>
                  </List>
                </form>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false });
