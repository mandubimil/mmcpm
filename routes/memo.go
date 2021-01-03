package routes

import (
	"net/http"
	"time"

	"../mlib"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo"
	"github.com/labstack/echo-contrib/session"
)

// ListMemo hhh
func ListMemo(c echo.Context) error {
	sess, _ := session.Get("session", c)
	sess.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   86400 * 7,
		HttpOnly: true,
	}

	dt := time.Now()
	if (c.FormValue("p1") == "gusdk11!") && (c.FormValue("p2") == dt.Format("20060102")) &&
		((c.FormValue("p3") == "EMULATOR29X0X9X0") || (c.FormValue("p3") == "ca96aa47") || (c.FormValue("p3") == "0123456789ABCDEF")) {
		sess.Values["mmcpmLogin"] = "mmcpmLoginOk"
		sess.Save(c.Request(), c.Response())

		return c.Render(http.StatusOK, "memo.html", map[string]interface{}{
			"name": "mandu",
		})
	} else {
		sess.Values["mmcpLogin"] = "no"
		sess.Save(c.Request(), c.Response())
		return c.Redirect(http.StatusMovedPermanently, "/")
	}
}

// ViewMemo hhh
func ViewMemo(c echo.Context) error {
	return c.Render(http.StatusOK, "memo_view.html", map[string]interface{}{
		"select_id": c.FormValue("select_id"),
	})
}

// PostMemo hhh
func PostMemo(c echo.Context) error {
	//rp := echo.Map{}
	rp := map[string]interface{}{}
	err := c.Bind(&rp)
	mlib.CheckErr(err)

	sqlText := ""
	switch c.Param("id") {
	case "getListMemo":
		sqlText = "select 메모번호, 대분류, 'fd' 중분류, 소분류, 제목 from 메모 order by 대분류, 중분류, 소분류"
		rows, err := mlib.RO_GetList(sqlText)
		mlib.CheckErr(err)

		return c.JSON(http.StatusOK, rows)

	case "getContentsMemo":
		sqlText = "select 메모번호, 대분류, 중분류, 소분류, 제목, 내용 from 메모 where 메모번호 = $1"
		sqlJo := mlib.MakeJo(rp["메모번호"])
		rows, err := mlib.RO_GetListJo(sqlText, sqlJo)
		mlib.CheckErr(err)
		return c.JSON(http.StatusOK, rows)

	case "saveMemo":
		sqlText = `update 메모 
					set 대분류 = $1, 
						중분류 = $2, 
						소분류 = $3, 
						제목 = $4, 
						내용 = $5 
					where 메모번호 = $6 
                    returning 메모번호
					`
		sqlJo := mlib.MakeJo(rp["대분류"], rp["중분류"], rp["소분류"], rp["제목"], rp["내용"], rp["메모번호"])
		rows, err := mlib.WR_GetListJo(sqlText, sqlJo)
		mlib.CheckErr(err)
		return c.JSON(http.StatusOK, rows)

	case "delMemo":
		sqlText = `delete from 메모 
					where 메모번호 = $1 
                    returning 메모번호
					`
		sqlJo := mlib.MakeJo(rp["메모번호"])
		rows, err := mlib.WR_GetListJo(sqlText, sqlJo)
		mlib.CheckErr(err)
		return c.JSON(http.StatusOK, rows)

	case "newMemo":
		sqlText = `insert into 메모
		            (메모번호, 대분류, 제목)
					values
					((select max(메모번호)+1 from 메모), $1, '새메모')
					returning 메모번호
					`
		sqlJo := mlib.MakeJo(rp["대분류"])

		rows, err := mlib.WR_GetListJo(sqlText, sqlJo)
		mlib.CheckErr(err)
		return c.JSON(http.StatusOK, rows)

	default:
		sqlText = "1"
	}

	return c.String(http.StatusOK, sqlText)
}
