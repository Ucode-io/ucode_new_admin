import {useEffect, useMemo, useState} from "react"
import {useParams} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"
import {useFieldArray, useForm} from "react-hook-form"
import {Checkbox, Popover} from "@mui/material"
import {Clear} from "@mui/icons-material"
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined"

import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton"
import {filterActions} from "../../../../store/filter/filter.slice"
import {PinFilled, PlusIcon} from "../../../../assets/icons/icon"
import HFSelect from "../../../../components/FormElements/HFSelect"
import useFilters from "../../../../hooks/useFilters"
import {Filter} from "../FilterGenerator"
import styles from "./style.module.scss"
import constructorObjectService from "@/services/constructorObjectService";

const NewFilterModal = ({anchorEl, handleClose, fieldsMap = {}, view}) => {
  const dispatch = useDispatch()
  const {tableSlug} = useParams()
  const [didUpdate, setDidUpdate] = useState(false)
  const {new_list} = useSelector((s) => s.filter)
  const {filters} = useFilters(tableSlug, view.id)
  const [responseForGrouping, setResponseForGrouping] = useState([])
  const [selectedOption, setSelectedOption] = useState('')
  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined

  const {control, watch, reset} = useForm({
    defaultValues: {
      new: [],
    },
  })

  useEffect(() => {
    if (open) {
      constructorObjectService
        .getList(tableSlug, {
          data: {
            with_relations: true
          }
        })
        .then((res) => {
          setResponseForGrouping(res.data)
        })
        .catch((a) => (
          console.log('error', a)
        ))
    }
  }, [open])

  const onChange = (value, name) => {
    dispatch(
      filterActions.setFilter({
        tableSlug: tableSlug,
        viewId: view.id,
        name,
        value,
      })
    )
  }

  const {fields, append, remove} = useFieldArray({
    control,
    name: "new",
  })

  const computedOptions = useMemo(() => {
    const groups = responseForGrouping?.relation_fields?.map(item => item.table_label).filter(function (item, pos) {
      return responseForGrouping?.relation_fields?.map(item => item.table_label).indexOf(item) == pos;
    })

    const compute = groups?.map((item) => {
      return {
        label: item,
        options: responseForGrouping.relation_fields.filter(option => option.table_label === item).map((option => ({
          label: option.label,
          value: option.id
        })))
      }
    }) ?? []

    const old = [{
      label: 'Fields',
      options: Object.values(fieldsMap ?? {})?.map((i) => ({...i, value: i.id}))
    }]

    return [...old, ...compute]
  }, [fieldsMap, responseForGrouping])

  const isAddBtnDisabled = useMemo(() => {
    return fields.length === computedOptions.length
  }, [fields, computedOptions])

  const filtered = useMemo(() => {
    return [
      ...Object.values(fieldsMap).filter(
        (i) =>
          Object.keys(filters ?? {}).includes(i.slug) &&
          !(new_list[tableSlug] ?? []).find((j) => i.id === j.id)
      ),
      ...(new_list[tableSlug] ?? []),
    ]
  }, [filters, fieldsMap, new_list, tableSlug])

  useEffect(() => {
    if (filtered.length && !didUpdate) {
      setDidUpdate(true)
      reset({
        new: filtered?.map((i) => ({
          checked: i.checked,
          left_field: i.id,
        })),
      })
    }
  }, [filtered, didUpdate])
  return (
    <div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => {
          handleClose()
        }}
        sx={{
          zIndex: 100,
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div className={styles.new_modal}>
          {fields.map((field, index) => (
            <div key={field.id} className={styles.new_modal_item}>
              <Checkbox
                checked={
                  new_list[tableSlug]?.find(
                    (i) => i.id === watch(`new.${index}.left_field`)
                  )?.checked
                }
                checkedIcon={<PinFilled/>}
                icon={<PushPinOutlinedIcon/>}
                disabled={
                  !(
                    watch(`new.${index}.left_field`) &&
                    !view?.quick_filters?.find(
                      (i) => i.field_id === watch(`new.${index}.left_field`)
                    )
                  )
                }
                onChange={(e) =>
                  dispatch(
                    filterActions.setNewFilter({
                      tableSlug,
                      fieldId: watch(`new.${index}.left_field`),
                      checked: e.target.checked,
                    })
                  )
                }
                name={`new.${index}.checked`}
              />
              <HFSelect
                control={control}
                options={computedOptions}
                optionType={'GROUP'}
                onChange={(e) => {
                  setSelectedOption(e)
                  if (e) {
                    dispatch(
                      filterActions.setNewFilter({
                        tableSlug,
                        fieldId: e,
                        checked: watch(`new.${index}.checked`),
                      })
                    )
                  }
                }}
                name={`new.${index}.left_field`}
              />

              <Filter
                disabled
                field={
                  watch(`new.${index}.left_field`)
                    ? fieldsMap[watch(`new.${index}.left_field`)]
                    : ""
                }
                name={
                  fieldsMap?.[watch(`new.${index}.left_field`)]?.path_slug ??
                  fieldsMap?.[watch(`new.${index}.left_field`)]?.slug
                }
                onChange={onChange}
                filters={filters}
                tableSlug={tableSlug}
              />

              <RectangleIconButton
                color="white"
                onClick={() => {
                  dispatch(
                    filterActions.clearNewFilter({
                      tableSlug,
                      fieldId: watch(`new.${index}.left_field`),
                    })
                  )
                  dispatch(
                    filterActions.removeFromList({
                      tableSlug,
                      viewId: view.id,
                      name:
                        fieldsMap?.[watch(`new.${index}.left_field`)]
                          ?.path_slug ??
                        fieldsMap?.[watch(`new.${index}.left_field`)]?.slug,
                    })
                  )
                  remove(index)
                }}
              >
                <Clear/>
              </RectangleIconButton>
            </div>
          ))}
          <div
            className={`${styles.add_btn} ${
              isAddBtnDisabled ? styles.disabled : ""
            }`}
            onClick={() =>
              !isAddBtnDisabled &&
              append({checked: false, left_field: "", right_field: ""})
            }
          >
            <PlusIcon/>
            Add
          </div>
        </div>
      </Popover>
    </div>
  )
}

export default NewFilterModal
