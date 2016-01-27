'Option Strict On
Option Explicit On

Imports System.Web
Imports System.IO
Imports System.Drawing
Imports Newtonsoft.Json

Public Class QuizMenuItem

    Public Property Title As String
    Public Property Description As String
    Public Property TitleScreenImageURL As String
    Public Property URL As String
    Public Property DateAdded As Date

End Class

Public Class QuizMenuItems

    Public Function GetAllQuizMenuItems() As List(Of QuizMenuItem)

        Dim myQuizMenuItems As New List(Of QuizMenuItem)
        Dim myDirectory As String = HttpContext.Current.Server.MapPath("../../data/")

        For Each myFileName As String In Directory.GetFiles(myDirectory)

            Dim myJSONMenuItem As Object = JsonConvert.DeserializeObject(File.ReadAllText(myFileName))
            Dim myQuizMenuItem As New QuizMenuItem

            If myJSONMenuItem("Title") IsNot Nothing Then

                myQuizMenuItem.Title = myJSONMenuItem("Title").Value
                myQuizMenuItem.Description = myJSONMenuItem("Description").Value
                myQuizMenuItem.TitleScreenImageURL = myJSONMenuItem("TitleScreenImageURL").Value
                myQuizMenuItem.URL = "/quiz/" & Path.GetFileNameWithoutExtension(myFileName).ToLower
                myQuizMenuItem.DateAdded = myJSONMenuItem("DateAdded").Value

                myQuizMenuItems.Add(myQuizMenuItem)

            End If

        Next

        Return myQuizMenuItems

    End Function

End Class