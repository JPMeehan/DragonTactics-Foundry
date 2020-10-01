lessc "dragontactics/styles/dragontactics-styles.less" "dragontactics/styles/dragontactics-styles.css"
Remove-Item .\dragontactics.zip
Compress-Archive -Path .\dragontactics -DestinationPath .\dragontactics.zip
Write-Output "Freshened up the project"