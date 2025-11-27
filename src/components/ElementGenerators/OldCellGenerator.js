
  // switch (field.type) {
  //   case "LOOKUP":
  //     return (
  //       <CellRelationFormElementForTableView
  //         relOptions={relOptions}
  //         isNewRow={isNewRow}
  //         tableView={tableView}
  //         disabled={isDisabled}
  //         isFormEdit
  //         isBlackBg={isBlackBg}
  //         updateObject={updateObject}
  //         isNewTableView={true}
  //         control={control}
  //         name={computedSlug}
  //         field={field}
  //         row={row}
  //         placeholder={field.attributes?.placeholder}
  //         setFormValue={setFormValue}
  //         index={index}
  //         defaultValue={defaultValue}
  //         relationfields={relationfields}
  //         data={data}
  //       />
  //     );

  //   case "LOOKUPS":
  //     return (
  //       <CellManyToManyRelationElement
  //         relOptions={relOptions}
  //         disabled={isDisabled}
  //         isFormEdit
  //         updateObject={updateObject}
  //         isNewTableView={true}
  //         isBlackBg={isBlackBg}
  //         control={control}
  //         name={computedSlug}
  //         field={field}
  //         row={row}
  //         placeholder={field.attributes?.placeholder}
  //         setFormValue={setFormValue}
  //         index={index}
  //         defaultValue={defaultValue}
  //       />
  //     );

  //   case "SINGLE_LINE":
  //     return (
  //       <HFTextField
  //         disabled={isDisabled}
  //         isFormEdit
  //         updateObject={updateObject}
  //         isNewTableView={true}
  //         isBlackBg={isBlackBg}
  //         control={control}
  //         name={computedSlug}
  //         fullWidth
  //         field={field}
  //         required={field.required}
  //         placeholder={field.attributes?.placeholder}
  //         defaultValue={defaultValue}
  //       />
  //     );
  //   case "PASSWORD":
  //     return (
  //       <HFPassword
  //         isDisabled={isDisabled}
  //         isFormEdit
  //         updateObject={updateObject}
  //         isNewTableView={true}
  //         isBlackBg={isBlackBg}
  //         control={control}
  //         name={computedSlug}
  //         fullWidth
  //         field={field}
  //         isTransparent={true}
  //         required={field.required}
  //         type="password"
  //         placeholder={field.attributes?.placeholder}
  //         defaultValue={defaultValue}
  //       />
  //     );

  //   case "SCAN_BARCODE":
  //     return (
  //       <InventoryBarCode
  //         control={control}
  //         name={computedSlug}
  //         fullWidth
  //         updateObject={updateObject}
  //         isNewTableView={true}
  //         setFormValue={setFormValue}
  //         required={field.required}
  //         placeholder={field.attributes?.placeholder}
  //         defaultValue={defaultValue}
  //         field={field}
  //         disabled={isDisabled}
  //       />
  //     );
  //   case "PHONE":
  //     return (
  //       <HFTextFieldWithMask
  //         disabled={isDisabled}
  //         isFormEdit
  //         updateObject={updateObject}
  //         isNewTableView={true}
  //         isBlackBg={isBlackBg}
  //         control={control}
  //         name={computedSlug}
  //         fullWidth
  //         isTransparent={true}
  //         required={field.required}
  //         placeholder={field.attributes?.placeholder}
  //         mask={"(99) 999-99-99"}
  //         defaultValue={defaultValue}
  //       />
  //     );

  //   case "FORMULA":
  //     return (
  //       <HFFormulaField
  //         disabled={isDisabled}
  //         isFormEdit
  //         updateObject={updateObject}
  //         isNewTableView={true}
  //         isTableView={true}
  //         isBlackBg={isBlackBg}
  //         control={control}
  //         name={computedSlug}
  //         fullWidth
  //         required={field.required}
  //         placeholder={field.attributes?.placeholder}
  //         mask={"(99) 999-99-99"}
  //         defaultValue={defaultValue}
  //         isTransparent={true}
  //       />
  //     );
  //   case "FORMULA_FRONTEND":
  //     return (
  //       <NewCHFFormulaField
  //         setFormValue={setFormValue}
  //         control={control}
  //         updateObject={updateObject}
  //         isNewTableView={true}
  //         isTableView={true}
  //         required={field.required}
  //         placeholder={field.attributes?.placeholder}
  //         name={computedSlug}
  //         fieldsList={fields}
  //         disabled={!isDisabled}
  //         isTransparent={true}
  //         field={field}
  //         index={index}
  //         defaultValue={defaultValue}
  //       />
  //     );

  //   case "PICK_LIST":
  //     return (
  //       <HFAutocomplete
  //         disabled={isDisabled}
  //         isBlackBg={isBlackBg}
  //         isFormEdit
  //         updateObject={updateObject}
  //         isNewTableView={true}
  //         control={control}
  //         name={computedSlug}
  //         width="100%"
  //         options={field?.attributes?.options}
  //         required={field.required}
  //         placeholder={field.attributes?.placeholder}
  //         defaultValue={defaultValue}
  //       />
  //     );

  //   case "MULTISELECT":
  //     return (
  //       <HFMultipleAutocomplete
  //         disabled={isDisabled}
  //         isFormEdit
  //         updateObject={updateObject}
  //         isNewTableView={true}
  //         control={control}
  //         name={computedSlug}
  //         width="100%"
  //         required={field.required}
  //         field={field}
  //         placeholder={field.attributes?.placeholder}
  //         isBlackBg={isBlackBg}
  //         defaultValue={defaultValue}
  //         data={data}
  //       />
  //     );
  //   case "MULTISELECT_V2":
  //     return (
  //       <HFMultipleAutocomplete
  //         disabled={isDisabled}
  //         isFormEdit
  //         updateObject={updateObject}
  //         isNewTableView={true}
  //         control={control}
  //         name={computedSlug}
  //         width="100%"
  //         required={field.required}
  //         field={field}
  //         placeholder={field.attributes?.placeholder}
  //         isBlackBg={isBlackBg}
  //         defaultValue={defaultValue}
  //         data={data}
  //       />
  //     );

  //   case "DATE":
  //     return (
  //       <HFDatePicker
  //         control={control}
  //         name={computedSlug}
  //         fullWidth
  //         updateObject={updateObject}
  //         isNewTableView={true}
  //         width={"100%"}
  //         mask={"99.99.9999"}
  //         isFormEdit
  //         isBlackBg={isBlackBg}
  //         required={field.required}
  //         placeholder={field.attributes?.placeholder}
  //         defaultValue={defaultValue}
  //         disabled={isDisabled}
  //         isTransparent={true}
  //       />
  //     );

  //   case "DATE_TIME":
  //     return (
  //       <HFDateTimePicker
  //         disabled={isDisabled}
  //         isFormEdit
  //         updateObject={updateObject}
  //         isNewTableView={true}
  //         isBlackBg={isBlackBg}
  //         showCopyBtn={false}
  //         control={control}
  //         name={computedSlug}
  //         required={field.required}
  //         placeholder={field.attributes?.placeholder}
  //         defaultValue={defaultValue}
  //         isTransparent={true}
  //       />
  //     );

  //   case "TIME":
  //     return (
  //       <HFTimePicker
  //         disabled={isDisabled}
  //         isFormEdit
  //         updateObject={updateObject}
  //         isNewTableView={true}
  //         isBlackBg={isBlackBg}
  //         control={control}
  //         name={computedSlug}
  //         required={field.required}
  //         placeholder={field.attributes?.placeholder}
  //         defaultValue={defaultValue}
  //         isTransparent={true}
  //       />
  //     );

  //   case "NUMBER":
  //     return (
  //       <HFNumberField
  //         disabled={isDisabled}
  //         isFormEdit
  //         updateObject={updateObject}
  //         isNewTableView={true}
  //         control={control}
  //         name={computedSlug}
  //         fullWidth
  //         required={field.required}
  //         placeholder={field.attributes?.placeholder}
  //         isBlackBg={isBlackBg}
  //         defaultValue={defaultValue}
  //         isTransparent={true}
  //       />
  //     );
  //   case "FLOAT":
  //     return (
  //       <HFFloatField
  //         disabled={isDisabled}
  //         isFormEdit
  //         updateObject={updateObject}
  //         isNewTableView={true}
  //         control={control}
  //         name={computedSlug}
  //         fullWidth
  //         required={field.required}
  //         placeholder={field.attributes?.placeholder}
  //         isBlackBg={isBlackBg}
  //         defaultValue={defaultValue}
  //         isTransparent={true}
  //       />
  //     );

  //   case "CHECKBOX":
  //     return (
  //       <HFCheckbox
  //         disabled={isDisabled}
  //         isFormEdit
  //         updateObject={updateObject}
  //         isNewTableView={true}
  //         isBlackBg={isBlackBg}
  //         control={control}
  //         name={computedSlug}
  //         required={field.required}
  //         defaultValue={defaultValue}
  //       />
  //     );

  //   case "SWITCH":
  //     return (
  //       <HFSwitch
  //         disabled={isDisabled}
  //         isFormEdit
  //         updateObject={updateObject}
  //         isNewTableView={true}
  //         isBlackBg={isBlackBg}
  //         control={control}
  //         name={computedSlug}
  //         required={field.required}
  //         defaultValue={defaultValue}
  //       />
  //     );

  //   case "EMAIL":
  //     return (
  //       <HFTextField
  //         disabled={isDisabled}
  //         isFormEdit
  //         updateObject={updateObject}
  //         isNewTableView={true}
  //         isBlackBg={isBlackBg}
  //         control={control}
  //         name={computedSlug}
  //         rules={{
  //           pattern: {
  //             value: /\S+@\S+\.\S+/,
  //             message: "Incorrect email format",
  //           },
  //         }}
  //         fullWidth
  //         required={field.required}
  //         placeholder={field.attributes?.placeholder}
  //         defaultValue={defaultValue}
  //       />
  //     );

  //   case "ICON":
  //     return (
  //       <HFIconPicker isFormEdit control={control} updateObject={updateObject} isNewTableView={true} name={computedSlug} required={field.required} defaultValue={defaultValue} />
  //     );
  //   case "MAP":
  //     return (
  //       <HFModalMap
  //         isTransparent={true}
  //         control={control}
  //         updateObject={updateObject}
  //         isNewTableView={true}
  //         field={field}
  //         defaultValue={defaultValue}
  //         isFormEdit
  //         name={computedSlug}
  //         required={field?.required}
  //       />
  //     );

  //   case "MULTI_LINE":
  //     return (
  //       <MultiLineCellFormElement
  //         control={control}
  //         isWrapField={isWrapField}
  //         updateObject={updateObject}
  //         isNewTableView={true}
  //         computedSlug={computedSlug}
  //         field={field}
  //         isDisabled={isDisabled}
  //       />
  //     );

  //   case "CUSTOM_IMAGE":
  //     return (
  //       <HFFileUpload
  //         isTransparent={true}
  //         control={control}
  //         updateObject={updateObject}
  //         isNewTableView={true}
  //         name={computedSlug}
  //         defaultValue={defaultValue}
  //         isFormEdit
  //         required={field.required}
  //       />
  //     );

  //   case "VIDEO":
  //     return (
  //       <HFVideoUpload
  //         control={control}
  //         updateObject={updateObject}
  //         isNewTableView={true}
  //         name={computedSlug}
  //         defaultValue={defaultValue}
  //         isFormEdit
  //         isBlackBg={isBlackBg}
  //         required={field.required}
  //         placeholder={field.attributes?.placeholder}
  //         isTransparent={true}
  //       />
  //     );

  //   case "FILE":
  //     return (
  //       <HFFileUpload
  //         control={control}
  //         updateObject={updateObject}
  //         isNewTableView={true}
  //         name={computedSlug}
  //         defaultValue={defaultValue}
  //         isFormEdit
  //         isBlackBg={isBlackBg}
  //         required={field.required}
  //         placeholder={field.attributes?.placeholder}
  //         isTransparent={true}
  //       />
  //     );

  //   case "COLOR":
  //     return (
  //       <HFColorPicker
  //         control={control}
  //         updateObject={updateObject}
  //         isNewTableView={true}
  //         name={computedSlug}
  //         defaultValue={defaultValue}
  //         isFormEdit
  //         isBlackBg={isBlackBg}
  //         required={field.required}
  //         placeholder={field.attributes?.placeholder}
  //         isTransparent={true}
  //       />
  //     );

  //   default:
  //     return (
  //       <div style={{ padding: "0 4px" }}>
  //         <CellElementGenerator field={field} row={row} />
  //       </div>
  //     );
  // }