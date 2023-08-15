import {Flex, Grid, GridItem} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import ConfirmDialog from "../../../components/Dialog/ConfirmDialog";
import {setActiveDish} from "../../../reducers/ui";
import {useApi} from "../../../services/fasterDriver";
import DishDetails from "./DishDetails";
import DishEdit from "./DishEdit";
import DishList from "./DishList";

const VIEW_MODE = {
  ADD: 0,
  EDIT: 1,
  VIEW: 2,
}
export default function RestaurantMenu () {
  const {activeDish} = useSelector(state => state.ui)
  const dispatch = useDispatch()
  const [viewMode, setViewMode] = useState(VIEW_MODE.VIEW)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const api = useApi()

  useEffect(() => {
    setViewMode(VIEW_MODE.VIEW)
  }, [activeDish])

  const onAddNew = () => {
    dispatch(setActiveDish(null))
    setTimeout(() => {
      setViewMode(VIEW_MODE.ADD)
    }, 10)
  }

  const onEdit = () => {
    setViewMode(VIEW_MODE.EDIT)
  }

  const onCancel = () => {
    setViewMode(VIEW_MODE.VIEW)
  }

  const onDelete = () => {
    setShowDeleteDialog(true)
  }

  const deleteDish = () => {
    setShowDeleteDialog(false)
    if (activeDish) {
      api.deleteDishApi(activeDish.id)
        .then(() => {
          api.fetchUserApi()
          dispatch(setActiveDish(null))
        })
    }
  }

  return (
    <Flex flexDirection='column' pt={{base: "120px", md: "75px"}}>
      <Grid
        templateColumns={{md: "1fr", lg: "1fr 1fr"}}
        gridGap={6}
      >
        <GridItem>
          <DishList onAddNew={onAddNew}/>
        </GridItem>
        <GridItem>
          {viewMode === VIEW_MODE.VIEW && <DishDetails onEdit={onEdit} onDelete={onDelete}/>}
          {viewMode === VIEW_MODE.ADD && <DishEdit onCancel={onCancel} isAdd={true}/>}
          {viewMode === VIEW_MODE.EDIT && <DishEdit onCancel={onCancel} isAdd={false}/>}
        </GridItem>
      </Grid>
      <ConfirmDialog
        title={'Delete Dish'}
        message={'Are you sure you want to delete this dish?'}
        onOk={deleteDish}
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false)
        }}
      />
    </Flex>
  )
}
