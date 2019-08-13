#pragma strict

public class FlappyBird_Obstacle extends MonoBehaviour{

	var loaded:boolean = false;
	var renderers:Renderer[] = null;
	var colliders:Collider[] = null;
	
	public function Awake():void {
		renderers = GetComponentsInChildren.<Renderer>();
		colliders = GetComponentsInChildren.<Collider>();
	}
	
	public function OnEnable():void {
		if (!loaded) {
			loaded = true;
			return;
		}
		SetChildrenActive(true);
	}

	public function OnDisable():void {
		SetChildrenActive(false);
	}
	
	public function SetChildrenActive(bool:boolean):void {
		var i:int;

		for (i = 0; i < renderers.length; i++) {
			var r:Renderer = renderers[i];
			if (r)
				r.enabled = bool;
		}
		for (i = 0; i < colliders.length; i++) {
			var c:Collider = colliders[i];
			if (c)
				c.enabled = bool;
		}
	}
}