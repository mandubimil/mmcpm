package routes

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"time"

	"../mlib"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo"
	"github.com/labstack/echo-contrib/session"
)

// ListCode hhh
func ListCode(c echo.Context) error {
	sess, _ := session.Get("session", c)
	sess.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   86400 * 7,
		HttpOnly: true,
	}

	dt := time.Now()
	if (c.FormValue("p1") == "gusdk11!") && (c.FormValue("p2") == dt.Format("20060102")) &&
		((c.FormValue("p3") == "EMULATOR29X0X9X0") || (c.FormValue("p3") == "ca96aa47") || (c.FormValue("p3") == "0123456789ABCDEF")) {
		fmt.Println(dt.Format("20060102!!!"))
		sess.Values["mmcpmLogin"] = "mmcpmLoginOk"
		sess.Save(c.Request(), c.Response())

		return c.Render(http.StatusOK, "code.html", map[string]interface{}{
			"name": "mandu",
		})
	} else {
		sess.Values["mmcpLogin"] = "no"
		sess.Save(c.Request(), c.Response())
		return c.Redirect(http.StatusMovedPermanently, "/")
	}
}

// ViewCode hhh
func ViewCode(c echo.Context) error {
	return c.Render(http.StatusOK, "code_view.html", map[string]interface{}{
		"select_id": c.FormValue("select_id"),
	})
}

// PostCode hhh
func PostCode(c echo.Context) error {
	//rp := echo.Map{}
	rp := map[string]interface{}{}
	err := c.Bind(&rp)
	mlib.CheckErr(err)

	mmcpConfig, _ := mlib.GetConfig()
	mmcpDir := mmcpConfig["dir"].(string)

	sqlText := ""
	switch c.Param("id") {
	case "getListCode":
		mlib.JIJI(mmcpDir + rp["select_path"].(string))

		fileList, err := mlib.GetFileList(mmcpDir + rp["select_path"].(string))
		mlib.CheckErr(err)

		return c.JSON(http.StatusOK, fileList)

	case "getContentsCode":
		// mlib.JIJI(rp["풀경로"].(string))
		rC, err := mlib.GetFileContents(rp["파일"].(string), rp["경로"].(string), rp["풀경로"].(string))
		mlib.CheckErr(err)

		return c.JSON(http.StatusOK, rC)

	case "saveCode":
		err := mlib.SaveFileContents(rp["풀경로"].(string), rp["내용"].(string))
		mlib.CheckErr(err)

		return c.JSON(http.StatusOK, "ok")

	case "newCode":
		err := mlib.NewFileContents(rp["경로"].(string)+"new", rp["타입"].(string))
		mlib.CheckErr(err)

		return c.JSON(http.StatusOK, "ok")

	case "renameCode":
		fmt.Println(rp["풀경로"], rp["경로"], rp["새파일이름"])
		err := mlib.RenameFileContents(rp["풀경로"].(string), rp["경로"].(string), rp["새파일이름"].(string))
		mlib.CheckErr(err)

		return c.JSON(http.StatusOK, "ok")

	case "runCode":
		cmdStr := "echo "
		switch rp["언어"] {
		case "go":
			cmdStr = "go run "
		case "py":
			cmdStr = "python3 "
		case "js":
			cmdStr = "node "
		default:
		}

		exeOut, err := mlib.ExeCmd(cmdStr + rp["풀경로"].(string))
		mlib.CheckErr(err)

		return c.String(http.StatusOK, exeOut)

	case "runQuery":
		resp, err := http.PostForm("http://192.168.0.112:3001/query_oracle",
			url.Values{"query_text": {rp["내용"].(string)}})

		mlib.CheckErr(err)

		data, err := ioutil.ReadAll(resp.Body)
		mlib.CheckErr(err)

		fmt.Printf(string(data))

		return c.String(http.StatusOK, string(data))

	default:
		sqlText = "1"
		fmt.Println(mmcpDir)
	}

	return c.String(http.StatusOK, sqlText)
}
