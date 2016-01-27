Option Strict On
Option Explicit On

Imports System.Collections.Generic
Imports System.IO
Imports System.Drawing
Imports Newtonsoft.Json

Public Class Quiz

    Public Property Title As String
    Public Property Description As String
    Public Property TitleScreenImageURL As String
    Public Property TitleScreenBase64Image As String
    Public Property URL As String
    Public Property QuizType As String
    Public Property DateAdded As Date
    Public Property Questions As List(Of Questions)
    Public Property Results As List(Of Results)

    Public Function SaveQuiz(ByVal myQuiz As Quiz) As Boolean

        'for data file
        Dim myDirectory As String = HttpContext.Current.Server.MapPath("../../data/")
        Dim myFileName As String = myQuiz.URL.ToString.ToLower
        Dim myFullPath As String = myDirectory & myFileName & ".json"

        'for image path
        Dim myImageDirectory As String = HttpContext.Current.Server.MapPath("../../images/quizes/") & myFileName
        Directory.CreateDirectory(myImageDirectory)

        'save images
        Dim myTitleScreenImage As Image = Base64toImage(myQuiz.TitleScreenBase64Image)
        myTitleScreenImage.Save(myImageDirectory & "\" & "title.jpg", Imaging.ImageFormat.Jpeg)
        myQuiz.TitleScreenImageURL = "images/quizes/" & myFileName & "/" & "title.jpg"
        myQuiz.TitleScreenBase64Image = Nothing

        For Each question As Questions In myQuiz.Questions

            If question.base64Image IsNot Nothing Then
                Dim myQuestionImage As Image = Base64toImage(question.base64Image)
                myQuestionImage.Save(myImageDirectory & "\" & question.id & ".jpg", Imaging.ImageFormat.Jpeg)

                question.imageURL = "images/quizes/" & myFileName & "/" & question.id & ".jpg"
                question.base64Image = Nothing
            End If

        Next

        'write json file
        File.WriteAllText(myFullPath, JsonConvert.SerializeObject(myQuiz, Formatting.Indented))

        Return True

    End Function

    Private Function Base64toImage(ByVal myBase64String As String) As Image

        Dim myImageBytes As Byte() = Convert.FromBase64String(myBase64String)
        Dim ms As New MemoryStream(myImageBytes, 0, myImageBytes.Length)
        Dim myImage As Image = Image.FromStream(ms, True)

        Return myImage

    End Function

End Class

Public Class Questions

    Public Property id As String
    Public Property question As String
    Public Property imageURL As String
    Public Property base64Image As String
    Public Property answerChoices As List(Of AnswerChoices)

End Class

Public Class AnswerChoices

    Public Property id As String
    Public Property choiceText As String
    Public Property isCorrect As Boolean
    Public Property choicePoints As Integer

End Class

Public Class Results

    Public Property name As String
    Public Property minScore As String
    Public Property maxScore As String
    Public Property imageURL As String
    Public Property base64Image As String
    Public Property description As String

End Class
