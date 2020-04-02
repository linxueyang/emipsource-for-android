
Ext.define('YZSoft.src.xform.FormContainer', {
    override: 'Ext.Container',

    constructor: function (config) {
        this.callParent(arguments);

        if (this.$autoFireFormLoad())
            this.fireEvent('formload');
    },

    $autoFireFormLoad: function () {
        return true;
    },

    $applyFormState: function () {
        var me = this,
            formdataset = me.config && me.config.formInfo && me.config.formInfo.formdataset,
            fields;

        if (!formdataset)
            return;

        fields = me.$getFieldsArrayBy(function (field) {
            return field.config && field.config.xdatabind;
        });

        Ext.each(fields, function (field) {
            var column = me.$getColumn(field.config && field.config.xdatabind);
            if (column)
                me.$applyWritable(field, column.Writeable);
        });
    },

    $getFormDataInner: function (fields, isGetRepeatData, data, vars) {
        var me = this;

        Ext.each(fields, function (field) {
            if (field.isRepeaterContainer) {
                var detailData = {},
                    items = field.getItems();

                items.each(function (item) {
                    var blockData = {},
                        blockVar = {},
                        blockFields;

                    if (!item.isRepeaterBlock)
                        return;

                    blockFields = me.$getFieldsArrayBy(function (field) {
                        return (field.config && field.config.xdatabind) || field.isRepeaterContainer;
                    }, function (field) {
                        return field.isRepeaterContainer;
                    }, item);

                    me.$getFormDataInner(blockFields, false, blockData, blockVar);

                    Ext.Object.each(blockData, function (tableName, value) {
                        var table = detailData[tableName] = detailData[tableName] || [];
                        Ext.Array.each(value, function (row) {
                            table.push(Ext.apply(row, {
                                $vars: blockVar
                            }));
                        });
                    });
                });

                Ext.apply(data, detailData);
            }
            else {
                var $var = me.$getVar(field.config && field.config.xdatabind),
                    table = $var && $var.table,
                    column = $var && $var.column;

                if ($var.isVar) {
                    vars[$var.name] = field.getValue(), column;
                    return;
                }

                if (!column || !column.Writeable)
                    return;

                if (!table.IsRepeatable || isGetRepeatData) {
                    var datatable = data[table.TableName] = data[table.TableName] || [{}],
                        row = datatable[0],
                        value;

                    if (field.isRadio) {
                        if (field.isChecked()) {
                            value = field.getValue();
                            row[column.ColumnName] = me.$parseFieldValue(value, column);
                        }
                    }
                    else if (field.isCheckbox) {
                        value = field.getSubmitValue();
                        row[column.ColumnName] = me.$parseFieldValue(value, column);
                    }
                    else {
                        value = field.getValue();
                        row[column.ColumnName] = me.$parseFieldValue(value, column);
                    }
                }
            }
        });
    },

    $setFormDataInner: function (fields, isSetRepeatData, formInfo, currow) {
        var me = this;

        Ext.each(fields, function (field) {
            if (field.isRepeaterContainer) {
            }
            else {
                var $var = me.$getVar(field.config && field.config.xdatabind),
                    table = $var && $var.table,
                    column = $var && $var.column;

                if (!table || !column)
                    return;

                var row;
                if (currow && currow.tableName == table.TableName)
                    row = currow.row;
                else
                    row = formInfo.formdataset[table.TableName].Rows[0];

                if (row.hasOwnProperty(column.ColumnName))
                    field.setValue(me.$formatFieldValue(row[column.ColumnName], column));
            }
        });
    },

    $getFormData: function () {
        var me = this,
            fields, data = {}, vars = {};

        fields = me.$getFieldsArrayBy(function (field) {
            return (field.config && field.config.xdatabind) || field.isRepeaterContainer;
        }, function (field) {
            return field.isRepeaterContainer;
        });

        me.$getFormDataInner(fields, true, data, vars);

        return {
            vars: vars,
            FormData: data
        };
    },

    $setFormData: function (formInfo) {
        var me = this,
            fields, data = {}, vars = {};

        fields = me.$getFieldsArrayBy(function (field) {
            return (field.config && field.config.xdatabind) || field.isRepeaterContainer;
        }, function (field) {
            return field.isRepeaterContainer;
        });

        me.$setFormDataInner(fields, true, formInfo, null);
    },

    $parseFieldValue: function (value, column) {
        return value;
    },

    $formatFieldValue: function (value, column) {
        return value;
    },

    $applyWritable: function (field, writeable) {
        if (!writeable) {
            if (!field.getDisabled() && !field.getReadOnly())
                field.setReadOnly(true);
        }
    },

    $getFieldsArrayBy: function (fn, $break, from) {
        var me = this,
            fields = [],
            from = from || me;

        var getFields = function (item) {
            if (fn(item)) {
                fields.push(item);
            }

            if (item.isContainer) {
                if (!$break || !$break(item)) {
                    item.items.each(getFields);
                }
            }
        };

        from.items.each(getFields);
        return fields;
    },

    $getVar: function (varname) {
        var me = this,
            varMaps = me.$varMaps || {},
            $var;

        if (!varname)
            return;

        $var = varMaps[varname];
        if ($var)
            return $var;

        $var = varMaps[varname] = me.$parseVarName(varname);
        return $var
    },

    $getColumn: function (varname) {
        var me = this,
            $var = me.$getVar(varname);

        return $var && $var.column;
    },

    $parseVarName: function (varname) {
        var me = this,
            names, len;

        if (!varname)
            return;

        names = varname.split('.');
        len = names.length;

        if (len == 0)
            return null;

        if (len == 1) {
            return {
                isVar: true,
                name: varname
            };
        }

        var tableName = names[len - 2],
            columnName = names[len - 1],
            formdataset = me.config && me.config.formInfo && me.config.formInfo.formdataset,
            $var, table, column;

        $var = {
            isVar: true,
            name: varname
        };

        table = formdataset && formdataset[tableName];
        column = table && table.Columns[columnName];
        if (column) {
            return {
                isColumn: true,
                tableName: tableName,
                columnName: columnName,
                table: table,
                column: column
            };
        }
        else {
            return {
                isVar: true,
                name: varname
            };
        }
    }
});