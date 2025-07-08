import { useState, } from "react"
import type { Dispatch, SetStateAction } from "react"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"

import { HexColorPicker } from "react-colorful"
import { type ICategory } from "./EventCalendar"
import { generateId } from "../utils"

interface IProps {
  open: boolean
  handleClose: Dispatch<SetStateAction<void>>
  categories: ICategory[]
  setCategories: Dispatch<SetStateAction<ICategory[]>>
}

export const AddCategoryModal = ({ open, handleClose, categories, setCategories }: IProps) => {
  const [color, setColor] = useState("#b32aa9")
  const [title, setTitle] = useState("")

  const onAddCategory = () => {
    setTitle("")
    setCategories([
      ...categories,
      {
        _id: generateId(),
        color,
        title,
      },
    ])
  }

  const onDeleteCategory = (_id: string) => setCategories(categories.filter((category) => category._id !== _id))

  const onClose = () => handleClose()

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add category</DialogTitle>
      <DialogContent>
        <DialogContentText>Create categories for your appointments.</DialogContentText>
        <Box>
          <TextField
            name="title"
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            sx={{ mb: 6 }}
            required
            variant="outlined"
            onChange={(e) => {
              setTitle(e.target.value)
            }}
            value={title}
          />
          <Box sx={{ display: "flex", justifyContent: "space-around" }}>
            <HexColorPicker color={color} onChange={setColor} />
            <Box sx={{ height: 80, width: 80, borderRadius: 1 }} className="value" style={{ backgroundColor: color }}></Box>
          </Box>
          <Box>
            <List sx={{ marginTop: 3 }}>
              {categories.map((category) => (
                <ListItem
                  key={category.title}
                  secondaryAction={
                    <IconButton onClick={() => onDeleteCategory(category._id)} color="error" edge="end">
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <Box
                    sx={{ height: 40, width: 40, borderRadius: 1, marginRight: 1 }}
                    className="value"
                    style={{ backgroundColor: category.color }}
                  ></Box>
                  <ListItemText primary={category.title} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ marginTop: 2 }}>
        <Button sx={{ marginRight: 2 }} variant="contained" color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={() => onAddCategory()}
          disabled={title === "" || color === ""}
          sx={{ marginRight: 2 }}
          variant="contained"
          color="success"
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}