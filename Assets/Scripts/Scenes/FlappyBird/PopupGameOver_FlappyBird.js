#pragma strict

public class PopupGameOver_FlappyBird extends MonoBehaviour{
	private var receiver: GameObject;
	
	private var numberOfObstaclesText: TextMesh;
	private var numberOfYardsText: TextMesh;
	
	private var gameplay: FlappyBird_Gameplay;
	
	public function Awake(): void{
		gameplay = GameObject.Find("Gameplay").GetComponent.<FlappyBird_Gameplay>();
	
		numberOfYardsText = transform.Find("Content/TxtDistance").GetComponent.<TextMesh>();
		numberOfObstaclesText = transform.Find("Content/TxtNumberOfObstacles").GetComponent.<TextMesh>();
		
		numberOfYardsText.text = Math.Floor(gameplay.distance).ToString() + " Yards";
		numberOfObstaclesText.text = gameplay.passes.ToString() + " Pipes";
	}
	
	public function Open(path: String, target: GameObject):GameObject{
		receiver = target;
		
		var popup:GameObject = Instantiate(Resources.Load(path, typeof(GameObject)) as GameObject) as GameObject;
		
		return popup;
	}
	
	public function Close(target: GameObject): void{
		if(!target)
			return;
			
		target.tag = "Untagged";
		
		Destroy(target);
		
		Resources.UnloadUnusedAssets();
		System.GC.Collect();
		
		if(receiver) {
			receiver.SendMessage("OnPopupClose", SendMessageOptions.DontRequireReceiver);
			receiver = null;
		}
	}
	
	public function OnClick(target: String): void{
		
		//var scene: String = target.Replace("Scene", "");
		
		switch(target){
			case "BtnRetry" :
				Application.LoadLevel(Application.loadedLevel);
				break;
			default:
				break;
		}
	}
}