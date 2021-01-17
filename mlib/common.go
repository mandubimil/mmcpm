package mlib

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
)

// CheckErr hhh
func CheckErr(e error) {
	if e != nil {
		panic(e)
	}
}

// GetConfig hhh
func GetConfig() (map[string]interface{}, error) {
	dat, err := ioutil.ReadFile("../mmcpm.conf")
	CheckErr(err)

	var mmcpConfig map[string]interface{}
	if err := json.Unmarshal(dat, &mmcpConfig); err != nil {
		panic(err)
	}

	return mmcpConfig, nil
}

// JIJI hhh
func JIJI(pLog interface{}) {
	fmt.Println("-")
	fmt.Println("-------------------------------------------------------------------------------")
	fmt.Println(pLog)
	fmt.Println("-------------------------------------------------------------------------------")
	fmt.Println("-")
}

// FileList hhh
type FileList struct {
	ID       string      `json:"id"`
	Value    string      `json:"value"`
	DirName  string      `json:"dirName"`
	FileName string      `json:"fileName"`
	FullName string      `json:"fullName"`
	FType    string      `json:"fType"`
	Data     interface{} `json:"data"`
}

// GetFileList hhh
func GetFileList(currDir string) ([]FileList, error) {
	rfl := []FileList{}

	files, err := ioutil.ReadDir(currDir)
	CheckErr(err)

	for _, f := range files {

		fl1FileType := "file"
		fl1Value := f.Name()
		if f.IsDir() || f.Name() == "disk_of_stock" {
			fl1FileType = "dir"
			fl1Value = "<font color=blue>" + fl1Value + "</font>"
		}
		fl1 := FileList{currDir + f.Name(), fl1Value, currDir, f.Name(), currDir + f.Name(), fl1FileType, nil}

		if f.IsDir() || f.Name() == "disk_of_stock" {
			subFl, err := GetFileList(currDir + f.Name() + "/")
			CheckErr(err)
			fl1.Data = subFl
		}

		rfl = append(rfl, fl1)
	}

	return rfl, nil
}

// GetJSONFormat hhh
func GetJSONFormat(jsonStr []byte) string {
	var prettyJSON bytes.Buffer
	err := json.Indent(&prettyJSON, jsonStr, "", "\t")
	CheckErr(err)

	return string(prettyJSON.Bytes())
}

// FileContents hhh
type FileContents struct {
	FileName string `json:"fileName"`
	DirName  string `json:"dirName"`
	FullName string `json:"fullName"`
	Contents string `json:"contents"`
}

// GetFileContents hhh
func GetFileContents(pFileName string, pDirName string, pFullName string) ([]FileContents, error) {
	dat, err := ioutil.ReadFile(pFullName)
	CheckErr(err)

	var rFile = []FileContents{}
	rf1 := FileContents{pFileName, pDirName, pFullName, string(dat)}
	rFile = append(rFile, rf1)

	return rFile, nil
}

// SaveFileContents hhh
func SaveFileContents(pFullName string, contents string) error {

	err := ioutil.WriteFile(pFullName, []byte(contents), 0644)
	CheckErr(err)

	return nil
}

// NewFileContents hhh
func NewFileContents(pFullName string, pFType string) error {

	if pFType == "file" {
		err := ioutil.WriteFile(pFullName, []byte(""), 0644)
		CheckErr(err)
	} else {
		err := os.Mkdir(pFullName, os.ModePerm)
		CheckErr(err)
	}

	return nil
}

// RenameFileContents hhh
func RenameFileContents(pFullName string, pDirName string, pNewFileName string) error {

	err := os.Rename(pFullName, pDirName+pNewFileName)
	CheckErr(err)

	return nil
}

// ExeCmd hhh
func ExeCmd_old(exeString string) (string, error) {
	exeCmd := exec.Command("bash", "-c", exeString)
	exeOut, err := exeCmd.Output()
	CheckErr(err)

	fmt.Println(">", exeString)
	fmt.Println(string(exeOut))

	return string(exeOut), nil
}

// ExeCmd hhh
func ExeCmd(exeString string) (string, error) {
	cmd := exec.Command("bash", "-c", exeString)
	var out bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &stderr
	err := cmd.Run()
	if err != nil {
		//fmt.Println(fmt.Sprint(err) + ": \n" + stderr.String())
		return fmt.Sprint(err) + ": \n" + stderr.String(), nil
	}
	//fmt.Println("Result: " + out.String())

	return out.String(), nil
}
