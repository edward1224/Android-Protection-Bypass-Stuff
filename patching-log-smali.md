```smali
    .locals 12

    # alfan modified here
    const-string v8, "TAG"

    new-instance v9, Ljava/lang/StringBuilder;

    invoke-direct {v9}, Ljava/lang/StringBuilder;-><init>()V

    const-string v10, "Value before XOR 1: "

    invoke-virtual {v9, v10}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v9, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    invoke-virtual {v9}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v9

    sget v10, Landroid/util/Log;->DEBUG:I

    invoke-static {v10, v8, v9}, Landroid/util/Log;->println(ILjava/lang/String;Ljava/lang/String;)I

    # end modified here

```
